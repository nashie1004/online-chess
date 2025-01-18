import { GameObjects, Scene } from "phaser";
import bg from "../../assets/wood4-800x800.jpg"
import previewMove from "../../assets/indicator.png"
import move from "../../assets/sounds/Move.ogg"
import capture from "../../assets/sounds/Capture.ogg"
import select from "../../assets/sounds/Select.ogg"
import check from "../../assets/sounds/Check.mp3"
import pieces, { Options as gameOptions, PieceNames, pieceImages, baseKingState } from "../utilities/constants";
import { IBothKingsPosition, IKingState, IMoveInfo, IPhaserContextValues, IPiecesCoordinates, IValidMove, PromoteTo } from "../utilities/types";
import PawnValidator from "../pieces/pawnValidator";
import { eventEmitter } from "../utilities/eventEmitter";
import GetInitialMoves from "../logic/getInitialMoves";
import IsStalemate from "../logic/IsStaleMate";
import IsCheck from "../logic/isCheck";
import PossibleMovesIfKingInCheck from "../logic/possibleMovesIfKingInCheck";
import IsCheckMate from "../logic/isCheckMate";
import KingCastled from "../logic/kingCastled";
import PawnPromote from "../logic/pawnPromote";

export class MainGameScene extends Scene{
    /**
     * Board: 800 x 800, Square: 100
     * unique name = piecename + x + y, example: 'wPawn-0-6'
     */
    private readonly tileSize: number;
    private readonly board: (null | GameObjects.Sprite)[][]
    private readonly previewBoard: (GameObjects.Sprite)[][] // has a visible property
    private readonly boardOrientationIsWhite: boolean;
    private readonly pieceCoordinates: IPiecesCoordinates;
    private selectedPiece: IMoveInfo | null;
    private reactState: IPhaserContextValues;
    private bothKingsPosition: IBothKingsPosition;

    constructor(key: string, isColorWhite: boolean) {
        super({ key });

        // sync react and phaser state
        this.reactState = {
            isWhitesTurn: true,
            moveHistory: { white: [], black: [] },
            captureHistory: { white: [], black: [] },
            promoteTo: "queen",
            isColorWhite, // player's color of choice
            isWhitesOrientation: isColorWhite,
            kingsState: baseKingState
        }

        // game internal state
        this.selectedPiece = null;
        this.boardOrientationIsWhite = isColorWhite;
        this.bothKingsPosition = {
            // if black orientation switch queen and king coords
            white: { x: this.boardOrientationIsWhite ? 4 : 3, y: this.boardOrientationIsWhite ? 7 : 0 }
            , black: { x: this.boardOrientationIsWhite ? 4 : 3, y: this.boardOrientationIsWhite ? 0 : 7 }
        };

        this.tileSize = gameOptions.tileSize; // 100

        // creates 8x8 grid
        this.board = Array.from({ length: 8}).map(_ => new Array(8).fill(null));
        this.previewBoard = Array.from({ length: 8 }).map(_ => new Array(8));

        this.pieceCoordinates = {
            white: [],
            black: [],
        };

    }

    // Load assets
    preload(){
        this.load.image("bg", bg);
        this.load.image("previewMove", previewMove)
        this.load.audio("move", move);
        this.load.audio("capture", capture);
        this.load.audio("select", select);
        this.load.audio("check", check);

        Object.entries(pieceImages).forEach(([pieceName, imagePath]) => {
            const blob = new Blob([imagePath], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            this.load.svg(pieceName, url, { width: this.tileSize, height: this.tileSize })
        })
    }

    create(){

        this.add.image(0, 0, "bg").setOrigin(0, 0) ;
        const select = this.sound.add("select");

        // create pieces

        // 1. preview moves
        this.board.forEach((row, rowIdx) => {
            row.forEach((_, colIdx) => {

                const previewMove =  this.add
                    .sprite(colIdx * this.tileSize, rowIdx * this.tileSize, "previewMove")
                    .setName(`previewMove-${colIdx}-${rowIdx}`)
                    .setOrigin(0, 0)
                    .setDepth(1)
                    .setVisible(false)
                    .setInteractive({ cursor: "pointer" })
                    .on("pointerover", () => { previewMove.setTint(0x98DEC7) })
                    .on("pointerout", () => { previewMove.clearTint() })
                    .on("pointerdown", () => this.move(colIdx, rowIdx), this)
                    .setAlpha(.5)
                    ;

                this.previewBoard[colIdx][rowIdx] = previewMove;
            })
        })

        // 2. actual pieces
        pieces.forEach(piece => {
            let { name, x, y } = piece;
            const pieceIsWhite = name[0] === "w";

            // if black orientation
            if (!this.boardOrientationIsWhite) {

                // flip y
                y = Math.abs(y - 7);

                // if king and or queen
                if (name.toLowerCase().indexOf("king") >= 0) {
                    x = 3;
                } else if (name.toLowerCase().indexOf("queen") >= 0) {
                    x = 4;
                }
            }

            const uniqueName = `${name}-${x}-${y}`;
            this.pieceCoordinates[pieceIsWhite ? "white" : "black"].push({
                name, x, y, uniqueName
            });

            const sprite = this.add
                .sprite(x * this.tileSize, y * this.tileSize, name.toString(), 1)
                .setOrigin(0, 0)
                .setName(uniqueName)
                .setInteractive({  cursor: "pointer" })
                .on("pointerover", () => {

                    // not allowed to move
                    if (
                        (name[0] !== "w" && this.reactState.isWhitesTurn) ||
                        (name[0] !== "b" && !this.reactState.isWhitesTurn)
                    ){
                        return;
                    }

                    sprite.setTint(0x98DEC7)
                })
                .on("pointerout", () => {
                    sprite.clearTint()
                 })
                .on("pointerdown", () => {

                    // not allowed to move
                    if (
                        (name[0] !== "w" && this.reactState.isWhitesTurn) ||
                        (name[0] !== "b" && !this.reactState.isWhitesTurn)
                    ){
                        return;
                    }

                    // use latest sprite name
                    // since on this.move() > pawn promotion the sprite name gets change
                    const pieceName = sprite.name.split("-")[0] as PieceNames
                    const pieceX = Number(sprite.name.split("-")[1])
                    const pieceY = Number(sprite.name.split("-")[2])

                    // show available moves
                    select.play();
                    this.resetMoves();
                    this.showPossibleMoves(pieceName, pieceX, pieceY);
                })
;
            this.board[x][y] = sprite;
        })

        // reset if click out of a select piece
        this.input.on("pointerdown", (_: Phaser.Input.Pointer, clickedSprite: GameObjects.Sprite[] | undefined) => {
            if (!clickedSprite || !this.selectedPiece) {
                return;
            }

            // if there is a selected piece and the clicked area has no sprite
            if (this.selectedPiece && clickedSprite.length < 1){
                this.resetMoves();
            }
        })

        // sync / listen to upcoming react state changes
        eventEmitter.on("setPromoteTo", (data: PromoteTo) => this.reactState.promoteTo = data);
        eventEmitter.on("setIsWhitesOrientation", (data: boolean) => this.reactState.isWhitesOrientation = data);
        eventEmitter.on("setKingsState", (data: IKingState) => this.reactState.kingsState = data);
    }

    resetMoves(){
        // reset selected piece
        this.selectedPiece = null;

        // reset preview
        this.previewBoard.forEach((row, rowIdx) => {
            row.forEach((_, colIdx) => {
                if (this.previewBoard[colIdx][rowIdx].visible){
                    this.previewBoard[colIdx][rowIdx].setVisible(false);
                }
            })
        })
    }

    /**
     * - once a piece is clicked, this func will run
     * to toggle/show possible moves and display ui preview squares to the user
     * - also filters down player moves if the king is in check
     * @param name
     * @param x
     * @param y
     */
    showPossibleMoves(name: PieceNames, x: number, y: number){
        // actual coords
        const uniqueName = `${name}-${x}-${y}`;
        const isWhite = name[0] === "w";
        const actualCoordinates = this.pieceCoordinates[isWhite ? "white" : "black"].find(i => i.uniqueName === uniqueName);
        if (!actualCoordinates) return;

        x = actualCoordinates.x;
        y = actualCoordinates.y;

        // validate
        let initialValidMoves: IValidMove[] = (new GetInitialMoves(
            this.board, this.reactState, 
            this.bothKingsPosition, this.boardOrientationIsWhite
        )).getInitialMoves(name, x, y, uniqueName);

        // set selected piece
        this.selectedPiece = { x, y, pieceName: uniqueName };

        // this returns null if the king isnt in check
        const actualValidMoves = (new PossibleMovesIfKingInCheck(
            this.board, this.selectedPiece
            ,this.reactState, this.bothKingsPosition
            ,this.boardOrientationIsWhite
        )).possibleMovesIfKingInCheck(name, initialValidMoves);

        if (actualValidMoves){
            initialValidMoves = actualValidMoves;
        }

        // handle absolute king pins

        // UI - shows the actual valid moves to the user
        initialValidMoves.forEach(item => {
            const prev = this.previewBoard[item.x][item.y].visible;
            this.previewBoard[item.x][item.y].setVisible(!prev)
        })
    }

    /**
     * - move piece to desired square
     * - saves capture history
     * - saves move history
     * @param newX
     * @param newY
     * @returns if the move has capture
     */
    move(newX: number, newY: number){
        let hasCapture = false;

        if (!this.selectedPiece) return hasCapture;

        // current piece to move
        const sprite = this.board[this.selectedPiece.x][this.selectedPiece.y];
        if (!sprite) return false;

        const isWhite = sprite?.name[0] === "w"
        const pieceName = sprite?.name ?? "";
        this.reactState.isWhitesTurn = !isWhite;

        // old coordinate
        this.board[this.selectedPiece.x][this.selectedPiece.y] = null;

        // capture
        if (this.mNormalCapture(newX, newY, isWhite)) hasCapture = true;
        if (this.mEnPassantCapture(pieceName, this.selectedPiece, isWhite, newX, newY)) hasCapture = true;

        // new coordinate
        this.board[newX][newY] = sprite;

        // This is for stalemate detection
        const pieceCoordinate = this.pieceCoordinates[isWhite ? "white" : "black"]
            .find(i => i.x === this.selectedPiece?.x && i.y === this.selectedPiece?.y);

        if (pieceCoordinate){
            pieceCoordinate.x = newX;
            pieceCoordinate.y = newY;
        }

        // some special logic
        (new PawnPromote(
            this.boardOrientationIsWhite, this.reactState
        )).pawnPromote(pieceName, newX, newY, isWhite, sprite);

        const kingCastled = (new KingCastled(
            this.board, this.reactState
            , this.bothKingsPosition, this.boardOrientationIsWhite
        )).kingCastled(pieceName, this.selectedPiece, isWhite, newX, newY);

        if (kingCastled){
            // display rook move to the user
            this.tweens.add({
                targets: [kingCastled.rookSprite],
                x: kingCastled.rook.newX * this.tileSize,
                y: kingCastled.rook.y * this.tileSize,
                ease: "Expo.easeInOuts",
                duration: 100,
            })
        }

        this.mSaveMoveHistory(isWhite, pieceName, this.selectedPiece, newX, newY);

        // if the move is a king, update private king pos state - this is used by the this.validateCheckOrCheckMateOrStalemate() function
        if (sprite.name.toLowerCase().indexOf("king") >= 0){
            this.bothKingsPosition[isWhite ? "white" : "black"].x = newX;
            this.bothKingsPosition[isWhite ? "white" : "black"].y = newY;
        }

        // transfer data from phaser to react
        eventEmitter.emit("setIsWhitesTurn", !isWhite)
        eventEmitter.emit("setMoveHistory", this.reactState.moveHistory)
        eventEmitter.emit("setCaptureHistory", this.reactState.captureHistory)

        // display move to the user
        this.tweens.add({
            targets: [sprite],
            x: newX * this.tileSize,
            y: newY * this.tileSize,
            ease: "Expo.easeInOuts",
            duration: 100,
        })

        this.resetMoves();

        // check for check or checkmate
        const kingSafety = this.validateCheckOrCheckMateOrStalemate(isWhite);

        // play sound
        hasCapture ? this.sound.play("capture") : this.sound.play("move");
        if (kingSafety !== 0) this.sound.play("check");
    }

    update(){
        // may not need this
    }

    mNormalCapture(newX: number, newY: number, isWhite: boolean){
        // if there is an opponent piece in the desired square, capture it
        const opponentPiece = this.board[newX][newY];

        if (opponentPiece){

            // save to capture history
            if (isWhite){
                this.reactState.captureHistory.white.push({ x: newX, y: newY, pieceName: opponentPiece.name })
            } else {
                this.reactState.captureHistory.black.push({ x: newX, y: newY, pieceName: opponentPiece.name })
            }

            this.pieceCoordinates[isWhite ? "black" : "white"] = 
                this.pieceCoordinates[isWhite ? "black" : "white"].filter(i => i.x !== newX || i.y !== newY);

            opponentPiece.destroy();
            return true;
        }

        return false;
    }

    mEnPassantCapture(pieceName: string, selectedPiece: IMoveInfo, isWhite: boolean, newX: number, newY: number): boolean{

        // check if pawn type
        if (pieceName.toLowerCase().indexOf("pawn") >= 0){

            // get the previous pawn' square before moving diagonally
            const pawnValidator = new PawnValidator(
                { x: selectedPiece.x, y: selectedPiece.y, name: isWhite ? PieceNames.wPawn : PieceNames.bPawn, uniqueName: pieceName }
                , this.board, this.reactState.moveHistory, false, this.bothKingsPosition, this.boardOrientationIsWhite);

            const validCapture = pawnValidator.validEnPassantCapture();

            if (validCapture){
                // since our current moved pawn is in the same y square value as the opponent
                // , (means the pawn is behind the opponent pawn) just subtract/add y direction
                const opponentPiece = this.board[validCapture.x][validCapture.y - pawnValidator.captureYDirection];

                if (opponentPiece && validCapture.x === newX && validCapture.y === newY){
                    opponentPiece.destroy();

                    this.pieceCoordinates[isWhite ? "black" : "white"] = 
                        this.pieceCoordinates[isWhite ? "black" : "white"].filter(i => i.x !== newX || i.y !== newY);

                    return true;
                }
            }

        }

        return false;
    }

    mSaveMoveHistory(isWhite: boolean, pieceName: string, selectedPiece: IMoveInfo, newX: number, newY: number){

        // save to move history
        if (isWhite){
            this.reactState.moveHistory.white.push({
                old: { pieceName, x: selectedPiece.x, y: selectedPiece.y },
                new: { pieceName, x: newX, y: newY },
            });
        } else {
            this.reactState.moveHistory.black.push({
                old: { pieceName, x: selectedPiece.x, y: selectedPiece.y },
                new: { pieceName, x: newX, y: newY },
            });
        }
    }

    /**
     *
     * @param sprite
     * @param isWhite
     * @param newX
     * @param newY
     * @returns 0 = no check or checkmate, 1 = check, 2 = checkmate, 3 = stalemate
     */
    validateCheckOrCheckMateOrStalemate(isWhite: boolean) : 0 | 1 | 2 {
        this.board[this.bothKingsPosition.black.x][this.bothKingsPosition.black.y]?.resetPostPipeline();
        this.board[this.bothKingsPosition.white.x][this.bothKingsPosition.white.y]?.resetPostPipeline();

        // reset all check or checkmate properties
        this.reactState.kingsState.black.checkedBy = [];
        this.reactState.kingsState.white.checkedBy = [];
        this.reactState.kingsState.white.isInCheck = false;
        this.reactState.kingsState.black.isInCheck = false;
        this.reactState.kingsState.white.isCheckMate = false;
        this.reactState.kingsState.black.isCheckMate = false;
        this.reactState.kingsState.white.isInStalemate = false;
        this.reactState.kingsState.black.isInStalemate = false;

        // check
        const isCheck = (new IsCheck(
            this.board, this.reactState
            ,this.bothKingsPosition, this.boardOrientationIsWhite
        )).validateCheck(isWhite);

        // 1. stalemate
        if (!isCheck){
            let isStalemate = (new IsStalemate(
                this.board, this.boardOrientationIsWhite
                ,this.pieceCoordinates, this.reactState
                ,this.bothKingsPosition
            )).isStalemate(!isWhite);

            if (isStalemate){
                this.reactState.kingsState[isWhite ? "black" : "white"].isInStalemate = true;
                return 0;
            }

            return 0;
        }

        // 2. check
        const king = isWhite ? this.bothKingsPosition.black : this.bothKingsPosition.white;
        const kingSprite = this.board[king.x][king.y];
        kingSprite?.postFX?.addGlow(0xE44C6A, 10, 2);

        // 3. checkmate 
        let isCheckMate = (new IsCheckMate(
            this.board, this.reactState
            ,this.bothKingsPosition, this.boardOrientationIsWhite
            ,this.pieceCoordinates
        )).isCheckmate();

        if (isCheckMate){
            if (this.reactState.kingsState.white.isInCheck){
                this.reactState.kingsState.white.isCheckMate = true;
            } else {
                this.reactState.kingsState.black.isCheckMate = true;
            }
        }

        eventEmitter.emit("setKingsState", this.reactState.kingsState);
        return (isCheckMate ? 2 : 1);
    }


}
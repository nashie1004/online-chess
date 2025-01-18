import { GameObjects, Scene } from "phaser";
import bg from "../../assets/wood4-800x800.jpg"
import previewMove from "../../assets/indicator.png"
import move from "../../assets/sounds/Move.ogg"
import capture from "../../assets/sounds/Capture.ogg"
import select from "../../assets/sounds/Select.ogg"
import check from "../../assets/sounds/Check.mp3"
import pieces, { Options as gameOptions, PieceNames, pieceImages, baseKingState } from "../utilities/constants";
import { IBothKingsPosition, IKingState, IMoveInfo, IPhaserContextValues, IPiecesCoordinates, IValidMove, PromoteTo } from "../utilities/types";
import { eventEmitter } from "../utilities/eventEmitter";
import IsStalemate from "../logic/IsStaleMate";
import IsCheck from "../logic/isCheck";
import IsCheckMate from "../logic/isCheckMate";
import KingCastled from "../logic/kingCastled";
import PawnPromote from "../logic/pawnPromote";
import PieceCapture from "../logic/pieceCapture";
import ShowPossibleMoves from "../logic/showPossibleMoves";

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

        this.pieceCoordinates = { white: [], black: [],};
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
                    this.selectedPiece = (new ShowPossibleMoves(
                        this.board, this.previewBoard
                        ,this.boardOrientationIsWhite, this.pieceCoordinates
                        ,this.selectedPiece, this.reactState
                        ,this.bothKingsPosition
                    )).showPossibleMoves(pieceName, pieceX, pieceY);
                    
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
        const pieceCapture = new PieceCapture(
            this.board, this.boardOrientationIsWhite, this.pieceCoordinates
            ,this.reactState, this.bothKingsPosition
        );

        if (pieceCapture.normalCapture(newX, newY, isWhite)) hasCapture = true;
        if (pieceCapture.enPassantCapture(pieceName, this.selectedPiece, isWhite, newX, newY)) hasCapture = true;

        // new coordinate
        this.board[newX][newY] = sprite;

        // Set new coordinate
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

    mSaveMoveHistory(isWhite: boolean, pieceName: string, selectedPiece: IMoveInfo, newX: number, newY: number){

        this.reactState.moveHistory[isWhite ? "white" : "black"].push({
            old: { pieceName, x: selectedPiece.x, y: selectedPiece.y },
            new: { pieceName, x: newX, y: newY },
        });
        
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
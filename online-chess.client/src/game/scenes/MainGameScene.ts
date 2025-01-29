import { GameObjects, Scene } from "phaser";
// import bg from "../../assets/wood4-800x800.jpg"
import bg from "../../assets/boards/green800.png"
//import bg from "../../assets/boards/brown.png"
import previewMove from "../../assets/indicator.png"
import move from "../../assets/sounds/Move.ogg"
import capture from "../../assets/sounds/Capture.ogg"
import select from "../../assets/sounds/Select.ogg"
import check from "../../assets/sounds/Check.mp3"
import pieces, { Options as gameOptions, PieceNames, pieceImages, baseKingState } from "../utilities/constants";
import { IBothKingsPosition, IKingState, IMoveHistory, IMoveInfo, IPhaserContextValues, IPiece, IPieceMove, IPiecesCoordinates, PromoteTo } from "../utilities/types";
import { eventEmitter } from "../utilities/eventEmitter";
import KingCastled from "../logic/kingCastled";
import PawnPromote from "../logic/pawnPromote";
import PieceCapture from "../logic/pieceCapture";
import ShowPossibleMoves from "../logic/showPossibleMoves";
import ValidateCheckOrCheckMateOrStalemate from "../logic/validateCheckOrCheckmateOrStalemate";

export class MainGameScene extends Scene{
    /**
     * Board: 800 x 800, Square: 100
     * unique name = piecename + x + y, example: 'wPawn-0-6'
     */

    // internal state
    private readonly tileSize: number;
    private readonly previewBoard: (GameObjects.Sprite)[][] // has a visible property
    private readonly boardOrientationIsWhite: boolean;
    private selectedPiece: IMoveInfo | null;
    private isPlayersTurnToMove: boolean;
    
    // server state
    private readonly board: (null | GameObjects.Sprite)[][]
    private readonly pieceCoordinates: IPiecesCoordinates;
    private moveHistory: IMoveHistory;
    private reactState: IPhaserContextValues;
    private bothKingsPosition: IBothKingsPosition;

    constructor(key: string, isColorWhite: boolean) {
        super({ key });

        // sync react and phaser state
        this.reactState = {
            promoteTo: "queen",
            isColorWhite, // player's color of choice
            isWhitesOrientation: isColorWhite,
            kingsState: baseKingState
        }

        // game internal state
        this.isPlayersTurnToMove = isColorWhite;
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
        this.moveHistory = { white: [], black: [] };
    }

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
                        !this.isPlayersTurnToMove || (
                            (this.boardOrientationIsWhite && name[0] !== "w") ||
                            (!this.boardOrientationIsWhite && name[0] !== "b")
                        ) 
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
                        !this.isPlayersTurnToMove || (
                            (this.boardOrientationIsWhite && name[0] !== "w") ||
                            (!this.boardOrientationIsWhite && name[0] !== "b")
                        ) 
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
                        ,this.bothKingsPosition, this.moveHistory
                    )).showPossibleMoves(pieceName, pieceX, pieceY);
                    
                });
                
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
        eventEmitter.on("setKingsState", (data: IKingState) => this.reactState.kingsState = data);
        eventEmitter.on("setEnemyMove", (data: IPieceMove) => {
            this.selectedPiece = {
                x: data.old.x,
                y: data.old.y,
                pieceName: data.old.uniqueName ?? ``
            }

            this.move(data.new.x, data.new.y);
            this.isPlayersTurnToMove = true;
        });
        eventEmitter.on("setMoveHistory", (data: IMoveHistory) => this.moveHistory = data);
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

    move(newX: number, newY: number){
        let hasCapture = false;

        if (!this.selectedPiece) return hasCapture;

        // current piece to move
        const sprite = this.board[this.selectedPiece.x][this.selectedPiece.y];
        if (!sprite) return false;

        const isWhite = sprite.name[0] === "w"
        const uniquePieceName = sprite.name;
        const pieceName = sprite.name.split("-")[0] as PieceNames;

        // old coordinate
        this.board[this.selectedPiece.x][this.selectedPiece.y] = null;

        // capture
        const pieceCapture = new PieceCapture(
            this.board, this.boardOrientationIsWhite, this.pieceCoordinates
            ,this.reactState, this.bothKingsPosition
            ,this.moveHistory
        );

        if (pieceCapture.normalCapture(newX, newY, isWhite)) hasCapture = true;
        if (pieceCapture.enPassantCapture(uniquePieceName, this.selectedPiece, isWhite, newX, newY)) hasCapture = true;

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
        )).pawnPromote(uniquePieceName, newX, newY, isWhite, sprite);

        const kingCastled = (new KingCastled(
            this.board, this.reactState
            , this.bothKingsPosition, this.boardOrientationIsWhite
            , this.moveHistory
        )).kingCastled(uniquePieceName, this.selectedPiece, isWhite, newX, newY);

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

        // if the move is a king, update private king pos state - this is used by the this.validateCheckOrCheckMateOrStalemate() function
        if (sprite.name.toLowerCase().indexOf("king") >= 0){
            this.bothKingsPosition[isWhite ? "white" : "black"].x = newX;
            this.bothKingsPosition[isWhite ? "white" : "black"].y = newY;
        }

        // transfer data from phaser to react
        const oldMove: IPiece = { x: this.selectedPiece.x, y: this.selectedPiece.y, uniqueName: uniquePieceName, name: pieceName };
        const newMove: IPiece = { x: newX, y: newY, uniqueName: uniquePieceName, name: pieceName };

        if (this.isPlayersTurnToMove){
            this.isPlayersTurnToMove = false;
            eventEmitter.emit("setMovePiece", { oldMove, newMove });
        }

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
        const kingSafety = (new ValidateCheckOrCheckMateOrStalemate(
            this.board, this.boardOrientationIsWhite
            , this.pieceCoordinates, this.reactState
            , this.bothKingsPosition, this.moveHistory
        )).validate(isWhite);

        // play sound
        hasCapture ? this.sound.play("capture") : this.sound.play("move");
        if (kingSafety !== 0) this.sound.play("check");
    }

    update(){
        // may not need this
    }
}
import { GameObjects, Scene } from "phaser";
import previewMove from "../../assets/indicator.png"
import move from "../../assets/sounds/Move.ogg"
import capture from "../../assets/sounds/Capture.ogg"
import select from "../../assets/sounds/Select.ogg"
import check from "../../assets/sounds/Check.mp3"
import pieces, { Options as gameOptions, PieceNames, baseKingState, eventEmit, eventOn, pieceNamesV2 } from "../utilities/constants";
import { IBothKingsPosition, IKingState, IMoveHistory, IMoveInfo, IPiece, IPieceMove, IPiecesCoordinates, PromoteTo } from "../utilities/types";
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
    private readonly previewBoard: (GameObjects.Sprite)[][]; // has a visible property
    private readonly boardOrientationIsWhite: boolean;
    private readonly board: (null | GameObjects.Sprite)[][];
    private selectedPiece: IMoveInfo | null;
    private isPlayersTurnToMove: boolean;
    private bothKingsPosition: IBothKingsPosition;
    private readonly boardUI: string;
    private readonly piecesUI: string;

    // server state
    private moveHistory: IMoveHistory;
    private kingsState: IKingState;
    private readonly pieceCoordinates: IPiecesCoordinates;
    private promotePreference: PromoteTo; // TODO

    constructor(key: string, isColorWhite: boolean, boardUI: string, piecesUI: string) {
        super({ key });

        this.boardUI = boardUI;
        this.piecesUI = piecesUI;

        // server state
        this.moveHistory = { white: [], black: [] };
        this.kingsState = baseKingState;
        this.pieceCoordinates = { white: [], black: [] };

        // internal state
        this.isPlayersTurnToMove = isColorWhite;
        this.boardOrientationIsWhite = isColorWhite;
        this.selectedPiece = null;
        this.bothKingsPosition = {
            // if black orientation switch queen and king coords
            white: { x: this.boardOrientationIsWhite ? 4 : 3, y: this.boardOrientationIsWhite ? 7 : 0 }
            , black: { x: this.boardOrientationIsWhite ? 4 : 3, y: this.boardOrientationIsWhite ? 0 : 7 }
        };
        this.tileSize = gameOptions.tileSize; // 100
        this.board = Array.from({ length: 8}).map(_ => new Array(8).fill(null)); // creates 8x8 grid
        this.previewBoard = Array.from({ length: 8 }).map(_ => new Array(8));
        this.promotePreference = "queen";
    }

    preload(){
        this.load.image("bg", `/src/assets/boards/${this.boardUI}`);
        this.load.image("previewMove", previewMove)
        this.load.audio("move", move);
        this.load.audio("capture", capture);
        this.load.audio("select", select);
        this.load.audio("check", check);

        pieceNamesV2.forEach(piece => {
            this.load.svg(
                piece.fullName
                , `/src/assets/pieces/${this.piecesUI}/${piece.shortName}.svg`
                , { width: this.tileSize, height: this.tileSize }
            );
        });

        /*
        Object.entries(pieceImages).forEach(([pieceName, imagePath]) => {
            const blob = new Blob([imagePath], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            this.load.svg(pieceName, url, { width: this.tileSize, height: this.tileSize })
        });
        */
    }

    getMinSize(){
        const { width, height } = this.scale.gameSize; 
        const minSize = Math.min(width, height); 
        return minSize;
    }

    create(){

        const board = this.add
            .image(this.scale.width / 2, this.scale.height / 2, "bg")
            .setOrigin(0.5) // Center the image
            .setDisplaySize(this.getMinSize(), this.getMinSize())

        this.scale.on("resize", () => {
            board.setDisplaySize(this.getMinSize(), this.getMinSize());
        }, this);

       // this.add.image(0, 0, "bg").setOrigin(0, 0) ;
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
                    .on("pointerdown", () => {
                        // console.log("CALL MOVE FUNC 1", colIdx, rowIdx)
                        this.move(colIdx, rowIdx)
                    }, this)
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
                        ,this.selectedPiece
                        ,this.bothKingsPosition, this.moveHistory
                        ,this.kingsState
                    )).showPossibleMoves(pieceName, pieceX, pieceY);
                    
                });
                
            this.board[x][y] = sprite;
        })

        // reset if click out of a select piece
        this.input.on("pointerdown", (_: Phaser.Input.Pointer, clickedSprite: GameObjects.Sprite[] | undefined) => {
            if (!clickedSprite || !this.selectedPiece) {
                return;
            }

            // if there is a sFelected piece and the clicked area has no sprite
            if (this.selectedPiece && clickedSprite.length < 1){
                this.resetMoves();
            }
        })

        // sync / listen to upcoming react state changes
        eventEmitter.on(eventOn.setPromoteTo, (data: PromoteTo) => this.promotePreference = data); // TODO
        eventEmitter.on(eventOn.setKingsState, (data: IKingState) => this.kingsState = data);
        eventEmitter.on(eventOn.setEnemyMove, (data: IPieceMove) => {
            // console.log("enemy event emit: ", data)

            this.selectedPiece = {
                x: data.old.x,
                y: data.old.y,
                pieceName: data.old.uniqueName ?? ``
            }

            // console.log("CALL MOVE FUNC 2", data.new.x, data.new.y)
            this.move(data.new.x, data.new.y);
            this.isPlayersTurnToMove = true;
        });
        eventEmitter.on(eventOn.setMoveHistory, (data: IMoveHistory) => {
            this.moveHistory = data;
        });
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

        // console.log("main move: ", this.selectedPiece, { newX, newY })

        const isWhite = sprite.name[0] === "w"
        const uniquePieceName = sprite.name;
        const pieceName = sprite.name.split("-")[0] as PieceNames;

        // old coordinate
        this.board[this.selectedPiece.x][this.selectedPiece.y] = null;

        // capture
        const pieceCapture = new PieceCapture(
            this.board, this.boardOrientationIsWhite, this.pieceCoordinates
            , this.bothKingsPosition
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
        const pawnPromoted = (new PawnPromote(
            this.boardOrientationIsWhite, this.promotePreference, this.pieceCoordinates // TODO dynamic promote
        )).pawnPromote(uniquePieceName, newX, newY, isWhite, sprite);

        const kingCastled = (new KingCastled(
            this.board
            , this.bothKingsPosition, this.boardOrientationIsWhite
            , this.moveHistory, this.pieceCoordinates
        )).kingCastled(uniquePieceName, this.selectedPiece, isWhite, newX, newY);

        if (kingCastled){
            // display rook move to the user 
            this.tweens.add({
                targets: [kingCastled.rookSprite],
                x: kingCastled.rook.newX * this.tileSize,
                y: kingCastled.rook.y * this.tileSize,
                ease: "Expo.easeInOuts",
                duration: 100,
            });
        }

        // if the move is a king, update private king pos state - this is used by the this.validateCheckOrCheckMateOrStalemate() function
        if (sprite.name.toLowerCase().indexOf("king") >= 0){
            // console.log("king move", newX, newY, sprite.name, this.selectedPiece)
            this.bothKingsPosition[isWhite ? "white" : "black"].x = newX;
            this.bothKingsPosition[isWhite ? "white" : "black"].y = newY;
        }

        // transfer data from phaser to react
        if (this.isPlayersTurnToMove){
            const oldMove: IPiece = { x: this.selectedPiece.x, y: this.selectedPiece.y, uniqueName: uniquePieceName, name: pieceName };
            const newMove: IPiece = { x: newX, y: newY, uniqueName: uniquePieceName, name: pieceName };
            
            this.isPlayersTurnToMove = false;
            // console.log("move piece: ", oldMove, newMove)
            console.log("sprite: ", sprite, this.selectedPiece, newX, newY)

            eventEmitter.emit(eventEmit.setMovePiece, { oldMove, newMove, hasCapture });
        }

        // display move to the user

        this.tweens.add({
            targets: [sprite],
            x: newX * this.tileSize,
            y: newY * this.tileSize,
            ease: "Expo.easeInOuts",
            duration: 100,
        });

        this.resetMoves();

        // check for check or checkmate
        this.board[this.bothKingsPosition.black.x][this.bothKingsPosition.black.y]?.resetPostPipeline();
        this.board[this.bothKingsPosition.white.x][this.bothKingsPosition.white.y]?.resetPostPipeline();

        const kingSafety = (new ValidateCheckOrCheckMateOrStalemate(
            this.board, this.boardOrientationIsWhite
            , this.pieceCoordinates
            , this.bothKingsPosition, this.moveHistory
            , this.kingsState
        )).validate(isWhite);

        // play sound
        hasCapture ? this.sound.play("capture") : this.sound.play("move");
        if (kingSafety !== 0){
            this.sound.play("check");
            // check
            const king = isWhite ? this.bothKingsPosition.black : this.bothKingsPosition.white;
            const kingSprite = this.board[king.x][king.y];
            kingSprite?.postFX?.addGlow(0xE44C6A, 10, 2);
        }

        // For testing only
        // console.info(" === TEST === ");
        if (kingSafety !== 0){
            // console.log(this.pieceCoordinates.white.filter(i => i.name.toLowerCase().indexOf("king") >= 0));
            // console.log(this.pieceCoordinates.black.filter(i => i.name.toLowerCase().indexOf("queen") >= 0));
            // console.log(this.bothKingsPosition)
            // console.log(this.selectedPiece)
            // console.log(pieceCoordinate)
        }
        // console.table(this.pieceCoordinates.black);
        // this.debugHelper();
    }

    update(){
        // may not need this
    }

    debugHelper(){
        const nonEmptyWhiteTiles: (any)[] = []
        const nonEmptyBlackTiles: (any)[] = []

        this.board.forEach((row, rowIdx) => {
            row.forEach((col, colIdx) => {
                if (!col) return;

                if (col.name[0] === "w"){
                    nonEmptyWhiteTiles.push({
                        uniqueName: col.name,
                        x: colIdx,
                        y: rowIdx
                    });

                    return;
                }

                nonEmptyBlackTiles.push({
                    uniqueName: col.name,
                    x: colIdx,
                    y: rowIdx
                });
            });
        })
        
        //console.log(nonEmptyWhiteTiles)
        // console.table([...nonEmptyWhiteTiles, ...nonEmptyBlackTiles]);
        // console.table(nonEmptyWhiteTiles.filter(i => i.uniqueName.toLowerCase().indexOf("pawn") >= 0));
    }
}
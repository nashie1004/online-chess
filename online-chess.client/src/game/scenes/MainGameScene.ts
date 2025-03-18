import { GameObjects, Scene } from "phaser";
import { Capture, Castle, PieceNames, PromotionPrefence, pieceNamesV2 as pieceNamesToPreload } from "../utilities/constants";
import { IBothKingsPosition, IKingState, IMoveHistory, IMoveInfo, IPiece, IPieceMove, IPiecesCoordinates, PlayersPromotePreference } from "../utilities/types";
import { eventEmitter } from "../utilities/eventEmitter";
import KingCastled from "../logic/kingCastled";
import PawnPromote from "../logic/pawnPromote";
import PieceCapture from "../logic/pieceCapture";
import ShowPossibleMoves from "../logic/showPossibleMoves";
import ValidateCheckOrCheckMateOrStalemate from "../logic/validateCheckOrCheckmateOrStalemate";
import { EVENT_ON } from "../../constants/emitters";
import { IMovePiece } from "../signalRhandlers/types";
import { IMoveHistoryAppend } from "../../context/types";
import { chessBoardNotation } from "../utilities/helpers";

export class MainGameScene extends Scene{
    /**
     * unique name = piecename + x + y, example: 'wPawn-0-6'
     */
    // 1.1 server state 
    private moveHistory: IMoveHistory;
    private bothKingsState: IKingState;
    private piecesCoordinates_Server: IPiece[];
    
    private piecesCoordinates_Internal: IPiecesCoordinates;
    private promotePreference: PlayersPromotePreference; 
    private bothKingsPosition: IBothKingsPosition;
    private isPlayersTurnToMove: boolean;

    // 2. internal state
    private readonly tileSize: number;
    private readonly previewBoard: (GameObjects.Sprite)[][]; // has a visible property
    private readonly boardOrientationIsWhite: boolean;
    private readonly board: (null | GameObjects.Sprite)[][];
    private selectedPiece: IMoveInfo | null;
    private userIsConnected: boolean;
    private gameIsOver: boolean;

    // 3. user preference
    private boardUI: string;
    private piecesUI: string;
    private coordinatesUIShow: boolean;

    constructor(
        key: string, isColorWhite: boolean, boardUI: string
        , piecesUI: string, piecesCoordinates_Server: IPiece[], moveHistory: IMoveHistory
        , bothKingsPosition: IBothKingsPosition, promotePreference: PlayersPromotePreference
        , isPlayersTurnToMove: boolean, bothKingsState: IKingState, userIsConnected: boolean
        , showCoords: boolean
    ) {
        super({ key });

        // 1.1 server state - server has these states
        this.moveHistory = moveHistory; 
        this.bothKingsState = bothKingsState;
        this.piecesCoordinates_Server = piecesCoordinates_Server;
        
        this.piecesCoordinates_Internal = { white: [], black: [] };
        this.promotePreference = promotePreference;
        this.bothKingsPosition = bothKingsPosition;
        this.isPlayersTurnToMove = isPlayersTurnToMove;

        // 2. internal state
        this.boardOrientationIsWhite = isColorWhite;
        this.selectedPiece = null;
        this.tileSize = 100;
        this.board = Array.from({ length: 8 }).map(_ => new Array(8).fill(null)); // creates 8x8 grid
        this.previewBoard = Array.from({ length: 8 }).map(_ => new Array(8));
        this.userIsConnected = userIsConnected;
        this.gameIsOver = false;

        // 3. user prefernce
        this.boardUI = boardUI;
        this.piecesUI = piecesUI;
        this.coordinatesUIShow = showCoords;
    }

    preload(){
        this.load.image(this.boardUI, `/boards/${this.boardUI}`);
        this.load.image("previewMove", "/indicator.png")
        this.load.audio("move", "/sounds/Move.ogg");
        this.load.audio("capture", "/sounds/Capture.ogg");
        this.load.audio("select", "/sounds/Select.ogg");
        this.load.audio("check", "/sounds/Check.mp3");
        this.load.audio("victory", "/sounds/lisp/Victory.mp3");
        this.load.audio("newPM", "/sounds/lisp/NewPM.mp3");
        this.load.audio("castle", "/sounds/lisp/Castles.mp3");
        this.load.audio("defeat", "/sounds/lisp/Defeat.mp3");

        pieceNamesToPreload.forEach(piece => {
            this.load.svg(
                `${this.piecesUI}-${piece.fullName}`
                , `/pieces/${this.piecesUI}/${piece.shortName}.svg`
                , { width: this.tileSize, height: this.tileSize }
            );
        });
    }

    getMinSize(){
        const { width, height } = this.scale.gameSize; 
        const minSize = Math.min(width, height); 
        return minSize;
    }

    create(){
        this.sound.play("newPM");

        const board = this.add
            .image(this.scale.width / 2, this.scale.height / 2, this.boardUI)
            .setOrigin(0.5) // Center the image
            .setDisplaySize(this.getMinSize(), this.getMinSize())
            .setName("board");
        
        this.scale.on("resize", () => {
            board.setDisplaySize(this.getMinSize(), this.getMinSize());
        }, this);

       // this.add.image(0, 0, "bg").setOrigin(0, 0) ;
       const select = this.sound.add("select");
       const boardNotation  = chessBoardNotation(this.boardOrientationIsWhite);
        const notationsSprite: GameObjects.Text[] = [];

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
                        this.move(colIdx, rowIdx);
                    }, this)
                    .setAlpha(.5)
                    ;
                
                this.previewBoard[colIdx][rowIdx] = previewMove;
                
                const textCoords = this.add.text(colIdx * this.tileSize, rowIdx * this.tileSize, boardNotation[colIdx][rowIdx], {
                    fontFamily: "Fira Sans",
                    color: rowIdx % 2 !== colIdx % 2  ? "#F5F5F5" : "#302E2B"
                }).setVisible(this.coordinatesUIShow);

                notationsSprite.push(textCoords);
            })
        });

        // 2. actual pieces
        this.piecesCoordinates_Server.forEach(piece => {
            let { name, x, y } = piece;
            const pieceIsWhite = name[0] === "w";

            // if black orientation, flip
            if (!this.boardOrientationIsWhite) {
                y = Math.abs(y - 7);
                x = Math.abs(x - 7);
            }

            if (name.toLowerCase().indexOf("king") >= 0) {
                x = this.bothKingsPosition[pieceIsWhite ? "white" : "black"].x;
                y = this.bothKingsPosition[pieceIsWhite ? "white" : "black"].y;
            } 

            const uniqueName = `${name}-${x}-${y}`;
            this.piecesCoordinates_Internal[pieceIsWhite ? "white" : "black"].push({
                name, x, y, uniqueName
            });

            const sprite = this.add
                .sprite(x * this.tileSize, y * this.tileSize, `${this.piecesUI}-${name}`, 1)
                .setOrigin(0, 0)
                .setName(uniqueName)
                .setInteractive({  cursor: "pointer" })
                .on("pointerover", () => {
                    // not allowed to move
                    if (this.gameIsOver) return;

                    if (
                        !this.isPlayersTurnToMove || (
                            (this.boardOrientationIsWhite && name[0] !== "w") ||
                            (!this.boardOrientationIsWhite && name[0] !== "b")
                        ) 
                        || !this.userIsConnected
                    ){
                        return;
                    }

                    sprite.setTint(0x98DEC7)
                    // sprite.setInteractive({ cursor: "pointer" });
                })
                .on("pointerout", () => {
                    sprite.clearTint()
                    //sprite.resetPostPipeline()
                 })
                .on("pointerdown", () => {
                    // not allowed to move
                    if (this.gameIsOver) return;

                    if (
                        !this.isPlayersTurnToMove || (
                            (this.boardOrientationIsWhite && name[0] !== "w") ||
                            (!this.boardOrientationIsWhite && name[0] !== "b")
                        ) 
                        || !this.userIsConnected
                    ){
                        return;
                    }

                    // use latest sprite name
                    // since on this.move ( ) > pawn promotion the sprite name gets change
                    const pieceName = sprite.name.split("-")[0] as PieceNames
                    const pieceX = Number(sprite.name.split("-")[1])
                    const pieceY = Number(sprite.name.split("-")[2])

                    // show available moves
                    select.play();
                    this.resetMoves();
                    //sprite.postFX.addGlow(0xD0CB86, 6, 2);

                    this.selectedPiece = (new ShowPossibleMoves(
                        this.board, this.previewBoard
                        ,this.boardOrientationIsWhite, this.piecesCoordinates_Internal
                        ,this.selectedPiece
                        ,this.bothKingsPosition, this.moveHistory
                        ,this.bothKingsState
                    )).showPossibleMoves(pieceName, pieceX, pieceY);
                    
                });
            
            this.board[x][y] = sprite;
        });
        
        this.updateKingStateUI(this.bothKingsState);

        // reset if click out of a select piece
        this.input.on("pointerdown", (_: Phaser.Input.Pointer, clickedSprite: GameObjects.Sprite[] | undefined) => {
            if (!clickedSprite || !this.selectedPiece) {
                return;
            }

            // if there is a sFelected piece and the clicked area has no sprite
            if (this.selectedPiece && clickedSprite.length < 1){
                this.resetMoves();
            }
        });

        // sync / listen to upcoming react state changes
        eventEmitter.on(EVENT_ON.SET_USER_IS_CONNECTED, (data: boolean) => {
            this.userIsConnected = data;
        });
        eventEmitter.on(EVENT_ON.SET_PROMOTE_TO, (data: any) => {
            const isWhite = data.isWhite as boolean;
            const preference = data.preference as PromotionPrefence;
            
            this.promotePreference[isWhite ? "white" : "black"] = preference;
        });
        eventEmitter.on(EVENT_ON.SET_ENEMY_MOVE, (data: IPieceMove) => {1
            this.selectedPiece = {
                x: data.old.x,
                y: data.old.y,
                pieceName: data.old.uniqueName ?? ``
            }
            this.isPlayersTurnToMove = false;
            
            this.move(data.new.x, data.new.y);

            this.isPlayersTurnToMove = true;
        });
        eventEmitter.on(EVENT_ON.SET_MOVE_HISTORY_APPEND, (data: IMoveHistoryAppend) => {
            const { moveIsWhite, moveInfo } = data;
            this.moveHistory[moveIsWhite ? "white" : "black"].push(moveInfo);
        });
        eventEmitter.on(EVENT_ON.SET_BOTH_KINGS_STATE, (data: IKingState) => {
            this.bothKingsState = data;
        });
        eventEmitter.on(EVENT_ON.SET_BOARD_UI, (data: string) => {
            this.boardUI = data;

            this.load.once("complete", () => {
                board.setTexture(this.boardUI).setDisplaySize(this.getMinSize(), this.getMinSize());
            });

            this.load.image(this.boardUI, `/boards/${this.boardUI}`);
            this.load.start();
        });
        eventEmitter.on(EVENT_ON.SET_PIECE_UI, (data: string) => {
            this.piecesUI = data;

            this.load.once("complete", () => {
                
                [...this.piecesCoordinates_Internal.white, ...this.piecesCoordinates_Internal.black].forEach(piece => {
                    const { x, y } = piece;
                    const sprite = this.board[x][y];
                    if (!sprite) return;

                    sprite.setTexture(`${this.piecesUI}-${sprite.name.split("-")[0]}`);
                });
                
            });
            
            pieceNamesToPreload.forEach(piece => {
                this.load.svg(
                    `${this.piecesUI}-${piece.fullName}`
                    , `/pieces/${this.piecesUI}/${piece.shortName}.svg`
                    , { width: this.tileSize, height: this.tileSize }
                );
            });

            this.load.start();
        });
        eventEmitter.on(EVENT_ON.SET_COORDS_UI_SHOW, (data: boolean) => {
            this.coordinatesUIShow = data;
            notationsSprite.forEach(text => {
                text.setVisible(data);
            });
        });
        eventEmitter.on(EVENT_ON.SET_GAME_OVER, (data: boolean) => {
            this.gameIsOver = data; // always true
            // this.sound.setVolume(0.5);
            this.sound.play("defeat");
        });

        eventEmitter.emit(EVENT_ON.SET_PHASER_DONE_LOADING, true)
        // console.log(this.game.isBooted, this.load.isReady())
        // this.load.on("complete", () => {
        // })
    }

    resetMoves(){
        this.selectedPiece = null;

        this.previewBoard.forEach((row, rowIdx) => {
            row.forEach((_, colIdx) => {
                if (this.previewBoard[colIdx][rowIdx].visible){
                    this.previewBoard[colIdx][rowIdx].setVisible(false);
                }
            });
        });
    }

    move(newX: number, newY: number){
        let capture: Capture = Capture.None; 
        let castle: Castle = Castle.None;
        let promote: boolean = false;
        let soundToPlay = "move";

        if (!this.selectedPiece) return;

        // current piece to move
        const sprite = this.board[this.selectedPiece.x][this.selectedPiece.y];
        if (!sprite) return;

        const isWhite = sprite.name[0] === "w";
        const uniquePieceName = sprite.name;
        const pieceName = sprite.name.split("-")[0] as PieceNames;

        // old coordinate
        this.board[this.selectedPiece.x][this.selectedPiece.y] = null;

        // capture
        const pieceCapture = new PieceCapture(
            this.board, this.boardOrientationIsWhite, this.piecesCoordinates_Internal
            , this.bothKingsPosition
            ,this.moveHistory
        );

        if (pieceCapture.normalCapture(newX, newY, isWhite)) capture = Capture.Normal;
        if (pieceCapture.enPassantCapture(uniquePieceName, this.selectedPiece, isWhite, newX, newY)) capture = Capture.EnPassant;

        // new coordinate
        this.board[newX][newY] = sprite;

        // Set new coordinate
        const pieceCoordinate = this.piecesCoordinates_Internal[isWhite ? "white" : "black"]
            .find(i => i.x === this.selectedPiece?.x && i.y === this.selectedPiece?.y);

        if (pieceCoordinate){
            pieceCoordinate.x = newX;
            pieceCoordinate.y = newY;
        }

        // some special logic
        promote = (new PawnPromote(
            this.boardOrientationIsWhite, this.promotePreference, this.piecesCoordinates_Internal, this.piecesUI
        )).pawnPromote(uniquePieceName, newX, newY, isWhite, sprite);

        const kingCastled = (new KingCastled(
            this.board
            , this.bothKingsPosition, this.boardOrientationIsWhite
            , this.moveHistory, this.piecesCoordinates_Internal
        )).kingCastled(uniquePieceName, this.selectedPiece, isWhite, newX, newY);

        if (kingCastled){
            castle = kingCastled.castle;

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
            this.bothKingsPosition[isWhite ? "white" : "black"].x = newX;
            this.bothKingsPosition[isWhite ? "white" : "black"].y = newY;
        }

        // display move to the user
        this.tweens.add({
            targets: [sprite],
            x: newX * this.tileSize,
            y: newY * this.tileSize,
            ease: "Expo.easeInOuts",
            duration: 100,
        });

        // check for check or checkmate
        this.board[this.bothKingsPosition.black.x][this.bothKingsPosition.black.y]?.resetPostPipeline();
        this.board[this.bothKingsPosition.white.x][this.bothKingsPosition.white.y]?.resetPostPipeline();

        const newKingsState = (new ValidateCheckOrCheckMateOrStalemate(
            this.board, this.boardOrientationIsWhite
            , this.piecesCoordinates_Internal
            , this.bothKingsPosition, this.moveHistory
            , this.bothKingsState
        )).validate(isWhite);

        this.updateKingStateUI(newKingsState);
        
        // transfer data from phaser to react
        if (this.isPlayersTurnToMove){
            const oldMove: IPiece = { x: this.selectedPiece.x, y: this.selectedPiece.y, uniqueName: uniquePieceName, name: pieceName };
            const newMove: IPiece = { x: newX, y: newY, uniqueName: uniquePieceName, name: pieceName };
            
            this.isPlayersTurnToMove = false;

            const movePiece: IMovePiece = {
                gameRoomKey: null, oldMove, newMove
                , capture, castle, kingsState: newKingsState
                , promote
            }

            eventEmitter.emit(EVENT_ON.SET_MOVE_PIECE, movePiece);
        }

        // play sound
        capture != Capture.None ? this.sound.play("capture") : this.sound.play("move");

        this.resetMoves();
        //this.debugHelper();
    }

    updateKingStateUI(bothKingsState: IKingState){

        if (
            bothKingsState.white.isInCheck || bothKingsState.black.isInCheck ||
            bothKingsState.white.isCheckMate || bothKingsState.black.isCheckMate
        )
        {
            this.sound.play("check");
            const king = this.bothKingsState.white.isInCheck ? this.bothKingsPosition.white : this.bothKingsPosition.black;
            const kingSprite = this.board[king.x][king.y];
            kingSprite?.postFX?.addGlow(0xE44C6A, 10, 2);
        }

    }

    update(){
        // may not need this
    }
}
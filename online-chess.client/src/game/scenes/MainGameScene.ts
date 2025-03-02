import { GameObjects, Scene } from "phaser";
import previewMove from "../../assets/indicator.png"
import move from "../../assets/sounds/Move.ogg"
import capture from "../../assets/sounds/Capture.ogg"
import select from "../../assets/sounds/Select.ogg"
import check from "../../assets/sounds/Check.mp3"
import { Capture, Castle, PieceNames, PromotionPrefence, pieceNamesV2 } from "../utilities/constants";
import { IBothKingsPosition, IKingState, IMoveHistory, IMoveInfo, IPiece, IPieceMove, IPiecesCoordinates, PlayersPromotePreference } from "../utilities/types";
import { eventEmitter } from "../utilities/eventEmitter";
import KingCastled from "../logic/kingCastled";
import PawnPromote from "../logic/pawnPromote";
import PieceCapture from "../logic/pieceCapture";
import ShowPossibleMoves from "../logic/showPossibleMoves";
import ValidateCheckOrCheckMateOrStalemate from "../logic/validateCheckOrCheckmateOrStalemate";
import { EVENT_EMIT, EVENT_ON } from "../../constants/emitters";
import { IMovePiece } from "../signalRhandlers/types";
import { IMoveHistoryAppend } from "../../context/types";

export class MainGameScene extends Scene{
    /**
     * unique name = piecename + x + y, example: 'wPawn-0-6'
     */
    // 1.1 server state - server has these states
    private moveHistory: IMoveHistory;
    private kingsState: IKingState;
    private piecesCoordinates_Server: IPiece[];
    
    // 1.2 server and internal state integrated
    private piecesCoordinates_Internal: IPiecesCoordinates;
    private promotePreference: PlayersPromotePreference; 
    private bothKingsPosition: IBothKingsPosition;

    // 2. internal state
    private readonly tileSize: number;
    private readonly previewBoard: (GameObjects.Sprite)[][]; // has a visible property
    private readonly boardOrientationIsWhite: boolean;
    private readonly board: (null | GameObjects.Sprite)[][];
    private selectedPiece: IMoveInfo | null;
    private isPlayersTurnToMove: boolean;

    private userIsConnected: boolean;

    // 3. user preference
    private readonly boardUI: string;
    private readonly piecesUI: string;

    constructor(
        key: string, isColorWhite: boolean, boardUI: string
        , piecesUI: string, piecesCoordinates_Server: IPiece[], moveHistory: IMoveHistory
        , bothKingsPosition: IBothKingsPosition, promotePreference: PlayersPromotePreference
        , isPlayersTurnToMove: boolean, kingsState: IKingState, userIsConnected: boolean
    ) {
        super({ key });

        // 1.1 server state - server has these states
        this.moveHistory = moveHistory; 
        this.kingsState = kingsState;
        this.piecesCoordinates_Internal = { white: [], black: [] };

        // 1.2 server and internal state integrated
        this.piecesCoordinates_Server = piecesCoordinates_Server;
        this.promotePreference = promotePreference;
        this.bothKingsPosition = bothKingsPosition;

        // 2. internal state
        this.isPlayersTurnToMove = isPlayersTurnToMove;
        this.boardOrientationIsWhite = isColorWhite;
        this.selectedPiece = null;
        this.tileSize = 100;
        this.board = Array.from({ length: 8 }).map(_ => new Array(8).fill(null)); // creates 8x8 grid
        this.previewBoard = Array.from({ length: 8 }).map(_ => new Array(8));

        this.userIsConnected = userIsConnected;

        // 3. user prefernce
        this.boardUI = boardUI;
        this.piecesUI = piecesUI;
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
                        this.move(colIdx, rowIdx);
                    }, this)
                    .setAlpha(.5)
                    ;

                this.previewBoard[colIdx][rowIdx] = previewMove;
            })
        })

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
                        || !this.userIsConnected
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
                    this.selectedPiece = (new ShowPossibleMoves(
                        this.board, this.previewBoard
                        ,this.boardOrientationIsWhite, this.piecesCoordinates_Internal
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
        eventEmitter.on(EVENT_ON.SET_USER_IS_CONNECTED, (data: boolean) => {
            this.userIsConnected = data;
        });
        eventEmitter.on(EVENT_ON.SET_PROMOTE_TO, (data: any) => {
            const isWhite = data.isWhite as boolean;
            const preference = data.preference as PromotionPrefence;
            
            this.promotePreference[isWhite ? "white" : "black"] = preference;
        });
        eventEmitter.on(EVENT_ON.SET_ENEMY_MOVE, (data: IPieceMove) => {
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
            if (data.moveIsWhite){
                this.moveHistory.white.push(data.moveInfo);
                return;
            }

            this.moveHistory.black.push(data.moveInfo);
        });

        //this.debugHelper();
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
        let capture: Capture = Capture.None; 
        let castle: Castle = Castle.None;

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
        (new PawnPromote(
            this.boardOrientationIsWhite, this.promotePreference, this.piecesCoordinates_Internal 
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

        const kingSafety = (new ValidateCheckOrCheckMateOrStalemate(
            this.board, this.boardOrientationIsWhite
            , this.piecesCoordinates_Internal
            , this.bothKingsPosition, this.moveHistory
            , this.kingsState
        )).validate(isWhite);

        // play sound
        capture != Capture.None ? this.sound.play("capture") : this.sound.play("move");

        if (kingSafety !== 0){
            this.sound.play("check");
            // check
            const king = isWhite ? this.bothKingsPosition.black : this.bothKingsPosition.white;
            const kingSprite = this.board[king.x][king.y];
            kingSprite?.postFX?.addGlow(0xE44C6A, 10, 2);
        }
        
        // transfer data from phaser to react
        if (this.isPlayersTurnToMove){
            const oldMove: IPiece = { x: this.selectedPiece.x, y: this.selectedPiece.y, uniqueName: uniquePieceName, name: pieceName };
            const newMove: IPiece = { x: newX, y: newY, uniqueName: uniquePieceName, name: pieceName };
            
            this.isPlayersTurnToMove = false;

            const movePiece: IMovePiece = {
                gameRoomKey: null, oldMove, newMove, capture, castle
            }

            eventEmitter.emit(EVENT_EMIT.SET_MOVE_PIECE, movePiece);
        }

        this.resetMoves();
        //this.debugHelper();
    }

    update(){
        // may not need this
    }

    debugHelper(){
        console.log(this.moveHistory);
    }
}
import { GameObjects, Scene } from "phaser";
import bg from "../assets/wood4-800x800.jpg"
import previewMove from "../assets/indicator.png"
import move from "../assets/sounds/Move.ogg"
import capture from "../assets/sounds/Capture.ogg"
import select from "../assets/sounds/Select.ogg"
import pieces from "../utils/constants";
import { gameOptions, PieceNames, pieceImages } from "../utils/constants";
import { ICaptureHistory, IMoveHistory, IMoveInfo, IValidMove } from "../utils/types";
import { eventEmitter } from "./eventEmitter";
import RookValidator from "../validators/piece/rookValidator";
import KnightValidator from "../validators/piece/knightValidator";
import BishopValidator from "../validators/piece/bishopValidator";
import QueenValidator from "../validators/piece/queenValidator";
import KingValidator from "../validators/piece/kingValidator";
import PawnValidator from "../validators/piece/pawnValidator";

export class MainGame extends Scene{
    /**
     * Board: 800 x 800, Square: 100
     * unique name = piecename + x + y, example: 'wPawn-0-6'
     */
    private moveHistory: IMoveHistory;
    private captureHistory: ICaptureHistory;
    private tileSize: number;
    private readonly board: (null | GameObjects.Sprite)[][]
    private readonly previewBoard: (GameObjects.Sprite)[][] // has a visible property
    private selectedPiece: IMoveInfo | null;
    private isWhitesTurn: boolean;

    constructor() {
        super();

        // game state
        this.isWhitesTurn = true;
        this.captureHistory = { white: [], black: [] }
        this.moveHistory = { white: [], black: [] };
        this.selectedPiece = null;
        
        this.tileSize = gameOptions.tileSize; // 100
        
        // creates 8x8 grid
        this.board = Array.from({ length: 8}).map(_ => new Array(8).fill(null));
        this.previewBoard = Array.from({ length: 8}).map(_ => new Array(8));
    }

    // Load assets
    preload(){
        this.load.image("bg", bg);
        this.load.image("previewMove", previewMove)
        this.load.audio("move", move);
        this.load.audio("capture", capture);
        this.load.audio("select", select);

        Object.entries(pieceImages).forEach(([pieceName, imagePath]) => {
            const blob = new Blob([imagePath], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            this.load.svg(pieceName, url, { width: this.tileSize, height: this.tileSize })
        })
    }

    create(){

        this.add.image(0, 0, "bg").setOrigin(0, 0) ;
        const move = this.sound.add("move");
        const capture = this.sound.add("capture");
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
                        const hasCapture = this.move(colIdx, rowIdx);
                        hasCapture ? capture.play() : move.play();
                    }, this)
                    .setAlpha(.5)
                    ;

                this.previewBoard[colIdx][rowIdx] = previewMove;
            })
        })

        // 2. actual pieces
        pieces.forEach(piece => {
            const { name, x, y } = piece;

            const sprite = this.add
                .sprite(x * this.tileSize, y * this.tileSize, name.toString(), 1)
                .setOrigin(0, 0)
                .setName(`${name}-${x}-${y}`)
                .setInteractive({  cursor: "pointer" }) 
                .on("pointerover", () => { 
                    
                    // not allowed to move
                    if (
                        (name[0] !== "w" && this.isWhitesTurn) || 
                        (name[0] !== "b" && !this.isWhitesTurn) 
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
                        (name[0] !== "w" && this.isWhitesTurn) || 
                        (name[0] !== "b" && !this.isWhitesTurn) 
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

    // gets available moves
    showPossibleMoves(name: PieceNames, x: number, y: number){
        // actual coords
        const fullPieceName = `${name}-${x}-${y}`;
        const actualCoordinates = this.findPieceCoordinates(fullPieceName);
        x = actualCoordinates?.x ?? 0;
        y = actualCoordinates?.y ?? 0;

        // validate
        let validMoves: IValidMove[] = [];

        switch(name){
            case PieceNames.bRook:
            case PieceNames.wRook:
                validMoves = (new RookValidator({ x, y, name }, this.board, this.moveHistory)).validMoves();
                break;
            case PieceNames.bKnight:
            case PieceNames.wKnight:
                validMoves = (new KnightValidator({ x, y, name }, this.board, this.moveHistory)).validMoves();
                break;
            case PieceNames.bBishop:
            case PieceNames.wBishop:
                validMoves = (new BishopValidator({ x, y, name }, this.board, this.moveHistory)).validMoves();
                break;
            case PieceNames.bQueen:
            case PieceNames.wQueen:
                validMoves = (new QueenValidator({ x, y, name }, this.board, this.moveHistory)).validMoves();
                break;
            case PieceNames.bKing:
            case PieceNames.wKing:
                validMoves = (new KingValidator({ x, y, name }, this.board, this.moveHistory)).validMoves();
                break;
            case PieceNames.bPawn:
            case PieceNames.wPawn:
                validMoves = (new PawnValidator({ x, y, name }, this.board, this.moveHistory)).validMoves();
                break;
            }
            
        // set selected piece
        this.selectedPiece = { x, y, pieceName: fullPieceName };

        // shows the actual valid moves to the user
        validMoves.forEach(item => {
            const prev = this.previewBoard[item.x][item.y].visible;
            this.previewBoard[item.x][item.y].setVisible(!prev)
        })
    }

    // move piece to desired square, saves capture and move history
    move(newX: number, newY: number): boolean{
        let hasCapture = false;

        if (!this.selectedPiece) return hasCapture;
        
        // current piece to move
        const sprite = this.board[this.selectedPiece.x][this.selectedPiece.y];
        const isWhite = sprite?.name[0] === "w"
        const pieceName = sprite?.name ?? "";
        this.isWhitesTurn = !isWhite;

        // old coordinate
        this.board[this.selectedPiece.x][this.selectedPiece.y] = null; 
        
        // === Start Capture === //
        // 1. Normal Capture
        // if there is an opponent piece in the desired square, capture it
        const opponentPiece = this.board[newX][newY];
        
        if (opponentPiece){ 

            // save to capture history
            if (isWhite){
                this.captureHistory.white.push({ x: newX, y: newY, pieceName: opponentPiece.name })
            } else {
                this.captureHistory.black.push({ x: newX, y: newY, pieceName: opponentPiece.name })
            }

            opponentPiece.destroy();
            hasCapture = true;
        }

        // 2. En Passant Capture
        
        // check if pawn type
        if (pieceName.toLowerCase().indexOf("pawn") >= 0){
            
            // get the previous pawn' square before moving diagonally
            const pawnValidator = new PawnValidator(
                { x: this.selectedPiece.x, y: this.selectedPiece.y, name: isWhite ? PieceNames.wPawn : PieceNames.bPawn }
                 , this.board, this.moveHistory
            );

            const validCapture = pawnValidator.validEnPassantCapture();
            
            if (validCapture){
                // since our current moved pawn is in the same y square value as the opponent
                // , (means the pawn is behind the opponent pawn) just subtract/add y direction
                const opponentPiece = this.board[validCapture.x][validCapture.y - pawnValidator.captureYDirection];

                if (opponentPiece){
                    opponentPiece.destroy();
                    hasCapture = true;
                }
            }

        }

        // === End Capture === //

        // new coordinate
        this.board[newX][newY] = sprite;

        // check if pawn and promotable
        if (
            (pieceName.toLowerCase().indexOf("pawn") >= 0)
            && ((newY === 0 && isWhite) || newY === 7 && !isWhite)
            && sprite
        ){
            // recreate sprite from pawn to queen
            const newName = isWhite ? sprite.name.replace("wPawn", "wQueen") : sprite.name.replace("bPawn", "bQueen");
            sprite.setName(newName + newX + newY);
            sprite.setTexture(isWhite ? "wQueen" : "bQueen");
        }

        // save to move history
        if (isWhite){
            this.moveHistory.white.push({
                old: { pieceName, x: this.selectedPiece.x, y: this.selectedPiece.y },
                new: { pieceName, x: newX, y: newY },
            });
        } else {
            this.moveHistory.black.push({
                old: { pieceName, x: this.selectedPiece.x, y: this.selectedPiece.y },
                new: { pieceName, x: newX, y: newY },
            });
        }

        // transfer data from phaser to react
        eventEmitter.emit("setIsWhitesTurn", !isWhite)
        eventEmitter.emit("setMoveHistory", this.moveHistory)
        eventEmitter.emit("setCaptureHistory", this.captureHistory)

        // display move to the user
        this.tweens.add({
            targets: [sprite],
            x: newX * this.tileSize, 
            y: newY * this.tileSize, 
            ease: "Expo.easeInOuts",
            duration: 100,
        })

        // reset
        this.resetMoves();
        return hasCapture;
    }

    // find by name 
    findPieceCoordinates(uniqueName: string){
        for (let i = 0; i < this.board.length; i++){
            for(let j = 0; j < this.board[i].length; j++){
             
                const currTile = this.board[j][i];

                // empty tile
                if (!currTile) continue;
                
                // found coords
                if (currTile.name === uniqueName) return ({ x: j, y: i })
            }
        }
    }

    update(){
        // TODO: handle movehistory, capturehistory and who will move next
        if (this.isWhitesTurn){
            // console.info(`White's turn to move`)
        } else {
            // console.info(`Black's turn to move`)
        }

    }

    resetGame(){

    }
}
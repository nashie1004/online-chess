import { GameObjects, Scene } from "phaser";
import bg from "../../assets/ChessBoard.png"
import previewMove from "../../assets/preview.png"

import wPawn from "../../assets/Chess - white casual/Pawn.png"
import wRook from "../../assets/Chess - white casual/Rook.png"
import wKnight from "../../assets/Chess - white casual/Knight.png"
import wBishop from "../../assets/Chess - white casual/Bishop.png"
import wQueen from "../../assets/Chess - white casual/Queen.png"
import wKing from "../../assets/Chess - white casual/King.png"

import bPawn from "../../assets/Chess - black casual/Pawn.png"
import bRook from "../../assets/Chess - black casual/Rook.png"
import bKnight from "../../assets/Chess - black casual/Knight.png"
import bBishop from "../../assets/Chess - black casual/Bishop.png"
import bQueen from "../../assets/Chess - black casual/Queen.png"
import bKing from "../../assets/Chess - black casual/King.png"
import pieces from "../../pieces";
import { gameOptions, PieceNames } from "../../utils/constants";
import MoveValidator from "../../validators/moveValidator";
import { ICaptureHistory, IMoveHistory, IMoveInfo, IValidMove } from "../../utils/types";

const pieceImages = {
    [PieceNames.wPawn]: wPawn,
    [PieceNames.wRook]: wRook,
    [PieceNames.wKnight]: wKnight,
    [PieceNames.wBishop]: wBishop,
    [PieceNames.wQueen]: wQueen,
    [PieceNames.wKing]: wKing,
    [PieceNames.bPawn]: bPawn,
    [PieceNames.bRook]: bRook,
    [PieceNames.bKnight]: bKnight,
    [PieceNames.bBishop]: bBishop,
    [PieceNames.bQueen]: bQueen,
    [PieceNames.bKing]: bKing,
};

export class MainGame extends Scene{
    /**
     * === Sizes ===
     * Board: 128 x 128 => 768 x 768
     * Square: 32 x 32 => 96 x 96
     * 
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
        
        this.tileSize = gameOptions.tileSize; // 96
        
        // creates 8x8 grid
        this.board = Array.from({ length: 8}).map(_ => new Array(8).fill(null));
        this.previewBoard = Array.from({ length: 8}).map(_ => new Array(8));
    }

    // Load assets
    preload(){
        this.load.image("bg", bg);
        this.load.image("previewMove", previewMove)

        Object.entries(pieceImages).forEach(([pieceName, imagePath]) => {
            this.load.spritesheet(pieceName, imagePath, { frameWidth: 96, frameHeight: 96 });
        })
    }

    create(){

        // each square is 96 x 96
        this.add.image(0, 0, "bg").setOrigin(0, 0).setScale(6);
        
        // create pieces

        // 1. preview moves 
        this.board.forEach((row, rowIdx) => {
            row.forEach((_, colIdx) => {

                const previewMove =  this.add
                    .sprite(colIdx * this.tileSize, rowIdx * this.tileSize, "previewMove")
                    .setName(`previewMove-${colIdx}-${rowIdx}`)
                    .setOrigin(0, 0)
                    .setScale(3)
                    .setDepth(2)
                    .setVisible(false)
                    .setInteractive({ cursor: "pointer" })
                    .on("pointerover", () => { previewMove.setTint(0x98DEC7) })
                    .on("pointerout", () => { previewMove.clearTint() })
                    .on("pointerdown", () => this.move(colIdx, rowIdx), this)
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
                .setScale(3)
                .setName(`${name}-${x}-${y}`)
                .setInteractive({  cursor: "pointer" }) 
                .on("pointerover", () => { 
                    sprite.setTint(0x98DEC7) 
                })
                .on("pointerout", () => { 
                    sprite.clearTint()
                 })
                .on("pointerdown", () => {
                    this.resetMoves();
                    this.showPossibleMoves(name, x, y);
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
        const validator = new MoveValidator(this.board, name);
        let validMoves: IValidMove[] = [];

        switch(name){
            case PieceNames.bRook:
            case PieceNames.wRook:
                validMoves = validator.rook(x, y);
                break;
            case PieceNames.bKnight:
            case PieceNames.wKnight:
                validMoves = validator.knight(x, y);
                break;
            case PieceNames.bBishop:
            case PieceNames.wBishop:
                validMoves = validator.bishop(x, y);
                break;
            case PieceNames.bQueen:
            case PieceNames.wQueen:
                validMoves = validator.queen(x, y);
                break;
            case PieceNames.bKing:
            case PieceNames.wKing:
                validMoves = validator.king(x, y);
                break;
            case PieceNames.bPawn:
            case PieceNames.wPawn:
                validMoves = validator.pawn(x, y);
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
    move(newX: number, newY: number){
        if (!this.selectedPiece) return;
        
        // current piece to move
        const sprite = this.board[this.selectedPiece.x][this.selectedPiece.y];
        const isWhite = sprite?.name[0] === "w"
        const pieceName = sprite?.name ?? "";
        this.isWhitesTurn = !isWhite;

        // old coordinate
        this.board[this.selectedPiece.x][this.selectedPiece.y] = null; 
        
        // if there is an opponent piece in the desired square, capture it
        const opponentPiece = this.board[newX][newY]
        if (opponentPiece){

            // save to capture history
            if (isWhite){
                this.captureHistory.white.push({ x: newX, y: newY, pieceName: opponentPiece.name })
            } else {
                this.captureHistory.black.push({ x: newX, y: newY, pieceName: opponentPiece.name })
            }

            opponentPiece.destroy();
        }

        // new coordinate
        this.board[newX][newY] = sprite;

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

        //this.input.on("pointerdown", (pointer: Phaser.Input.Pointer, gameObjects) => {
            // console.log(pointer.x / this.tileSize, pointer.y / this.tileSize, this.selectedPiece.validMoves)
            
          //  if (!this.selectedPiece.piece) return;

            // this.tweens.add({
            //     targets: [this.selectedPiece.piece],
            //     x: pointer.x, // Math.ceil(pointer.x) * this.tileSize,
            //     y: pointer.y, //Math.ceil(pointer.y) * this.tileSize,
            //     ease: "Expo.easeInOuts",
            //     duration: 100,
            // })
            //const test = Phaser.Math.Snap
        //})
    }
}
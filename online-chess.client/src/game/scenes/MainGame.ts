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
import { IValidMove } from "../../utils/types";

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
     */
    private tileSize: number;
    private board: (null | GameObjects.Sprite)[][]
    private previewBoard: (GameObjects.Sprite)[][] // has a visible property
    private test: boolean;

    constructor() {
        super();
        this.test = false;
        this.tileSize = gameOptions.tileSize; // 96
        
        // creates 8x8 grid
        this.board = Array.from({ length: 8}).map(_ => new Array(8).fill(null));

        this.previewBoard = Array.from({ length: 8}).map(_ => new Array(8));
    }

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
                this.previewBoard[colIdx][rowIdx] = this.add
                    .sprite(colIdx * this.tileSize, rowIdx * this.tileSize, "previewMove")
                    // .setName(`previewMove-${colIdx}-${rowIdx}`)
                    .setOrigin(0, 0)
                    .setScale(3)
                    .setDepth(2)
                    .setVisible(false)
                    ;
            })
        })

        // 2. actual pieces
        pieces.forEach(piece => {
            const { name, x, y } = piece;
            this.board[x][y] = this.createIndividualPiece(name, x, y);
        })

        // Drag event
        this.input.on("drag", (_: Phaser.Input.Pointer, gameObject, dragX: number, dragY: number) => {
            
            dragX = Phaser.Math.Snap.To(dragX, this.tileSize);
            dragY = Phaser.Math.Snap.To(dragY, this.tileSize);

            gameObject.setPosition(dragX, dragY);
        })

        
        this.input.keyboard.on('keydown-A', event =>
        {

            console.log('Hello from the A Key!');
            this.test = true
        });
    }

    createIndividualPiece(name: PieceNames, x: number, y: number) : GameObjects.Sprite {
        return this.add
            .sprite(x * this.tileSize, y * this.tileSize, name.toString(), 1)
            .setOrigin(0, 0)
            .setScale(3)
            // .setName(`${name}-${x}-${y}`)
            .setName(name)
            //.setInteractive({  cursor: "pointer" })
             .setInteractive({ draggable: true, cursor: "pointer" })
            // .on("clicked", this.clickEvent, this)
            .on("pointerover", function(){ this.setTint(0x98DEC7) })
            .on("pointerout", function(){ this.clearTint() })
            .on("pointerdown", (e: Phaser.Input.Pointer) => { 
                this.showPossibleMoves(name, x, y);
            })
            ;
    }

    showPossibleMoves(name: PieceNames, x: number, y: number){
        // reset preview
        this.previewBoard.forEach((row, rowIdx) => {
            row.forEach((_, colIdx) => {
                if (this.previewBoard[colIdx][rowIdx].visible){
                    this.previewBoard[colIdx][rowIdx].setVisible(false);
                }
            })
        })

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

        // shows the actual valid moves to the user
        validMoves.forEach(item => {
            const prev = this.previewBoard[item.x][item.y].visible;
            this.previewBoard[item.x][item.y].setVisible(!prev)
        })
    }

    update(){
        // const test = this.cursor;
        if (this.test){
            const group = this.add.group();
    
            //  Add an existing Image into the group:
    
            const blackrook = this.board[0][0];

            if (blackrook){

                group.add(blackrook);
        
                //  Any action done to the group is now reflected by the Image
                //  For example this will set the position of the image to 400 x 300
                Phaser.Actions.SetXY(group.getChildren(), 400, 300);
            }
            
        }
    }
}
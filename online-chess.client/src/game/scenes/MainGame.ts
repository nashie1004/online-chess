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
import { PieceName } from "../../utils/types";

export class MainGame extends Scene{
    /**
     * === Sizes ===
     * Board: 128 x 128 => 768 x 768
     * Square: 32 x 32 => 96 x 96
     */
    private tileSize: number;
    private board: (null | GameObjects.Sprite)[][]
    private previewBoard: (GameObjects.Sprite)[][] // has a visible property

    constructor() {
        super();
        this.tileSize = 96;
        
        // creates 8x8 grid
        this.board = Array.from({ length: 8}).map(_ => new Array(8).fill(null));

        this.previewBoard = Array.from({ length: 8}).map(_ => new Array(8));
    }

    preload(){
        this.load.image("bg", bg);
        this.load.image("previewMove", previewMove)
        
        this.load.spritesheet("wPawn", wPawn, { frameWidth: 96, frameHeight: 96 });
        this.load.spritesheet("wRook", wRook, { frameWidth: 96, frameHeight: 96 });
        this.load.spritesheet("wKnight", wKnight, { frameWidth: 96, frameHeight: 96 });
        this.load.spritesheet("wBishop", wBishop, { frameWidth: 96, frameHeight: 96 });
        this.load.spritesheet("wQueen", wQueen, { frameWidth: 96, frameHeight: 96 });
        this.load.spritesheet("wKing", wKing, { frameWidth: 96, frameHeight: 96 });
        
        this.load.spritesheet("bPawn", bPawn, { frameWidth: 96, frameHeight: 96 });
        this.load.spritesheet("bRook", bRook, { frameWidth: 96, frameHeight: 96 });
        this.load.spritesheet("bKnight", bKnight, { frameWidth: 96, frameHeight: 96 });
        this.load.spritesheet("bBishop", bBishop, { frameWidth: 96, frameHeight: 96 });
        this.load.spritesheet("bQueen", bQueen, { frameWidth: 96, frameHeight: 96 });
        this.load.spritesheet("bKing", bKing, { frameWidth: 96, frameHeight: 96 });
    }
    create(){

        // each square is 96 x 96
        this.add.image(0, 0, "bg").setOrigin(0, 0).setScale(6);
        
        // create pieces

        // 1. preview moves 
        this.board.forEach((row, rowIdx) => {
            row.forEach((col, colIdx) => {
                this.previewBoard[colIdx][rowIdx] = this.add
                    .sprite(colIdx * this.tileSize, rowIdx * this.tileSize, "previewMove")
                    .setName(`previewMove-${colIdx}-${rowIdx}`)
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

        console.log(this.previewBoard)
        
        // Drag event
        this.input.on("drag", (pointer: Phaser.Input.Pointer, gameObject, dragX: number, dragY: number) => {
            
            dragX = Phaser.Math.Snap.To(dragX, this.tileSize);
            dragY = Phaser.Math.Snap.To(dragY, this.tileSize);

            gameObject.setPosition(dragX, dragY);
        })
        
    }

    createIndividualPiece(name: PieceName, x: number, y: number) : GameObjects.Sprite {

        return this.add
        .sprite(x * this.tileSize, y * this.tileSize, name, 1)
        .setOrigin(0, 0)
        .setScale(3)
        .setName(`${name}-${x}-${y}`)
        .setInteractive({  cursor: "pointer" })
        // .setInteractive({ draggable: true, cursor: "pointer" })
        // .on("clicked", this.clickEvent, this)
        .on("pointerover", function(){ this.setTint(0x98DEC7) })
        .on("pointerout", function(){ this.clearTint() })
        .on("pointerdown", (e: Phaser.Input.Pointer) => { 
            this.showPossibleMoves(name, x, y);
        })
        ;
    }

    showPossibleMoves(name: PieceName, x: number, y: number){
        // TODO
        const isVisible = this.previewBoard[x][y].visible;
        this.previewBoard[0][0].setVisible(!isVisible);
        console.log(this.previewBoard[0][0].visible, isVisible)
    }

    update(){
        // const test = this.cursor;
    }
}
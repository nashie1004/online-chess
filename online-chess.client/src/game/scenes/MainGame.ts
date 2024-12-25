import { GameObjects, Scene } from "phaser";
import bg from "../../assets/ChessBoard.png"

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

export class MainGame extends Scene{
    /**
     * === Sizes ===
     * Board: 128 x 128 => 768 x 768
     * Squre: 32 x 32 => 96 x 96
     */
    private tileSize: number;
    private board: (null | GameObjects.Sprite)[][]

    constructor() {
        super();
        this.tileSize = 96;
        
        // creates 8x8 grid
        this.board = Array.from({ length: 8}).map(_ => {
            return new Array(8).fill(null);
        })
    }

    preload(){
        this.load.image("bg", bg);
        
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

        // 1.1 Black
        this.board[0][0] = this.createIndividualPiece("bRook", 0, 0);
        this.board[1][0] = this.createIndividualPiece("bKnight", 1, 0);
        this.board[2][0] = this.createIndividualPiece("bBishop", 2, 0);
        this.board[3][0] = this.createIndividualPiece("bQueen", 3, 0);
        this.board[4][0] = this.createIndividualPiece("bKing", 4, 0);
        this.board[5][0] = this.createIndividualPiece("bBishop", 5, 0);
        this.board[6][0] = this.createIndividualPiece("bKnight", 6, 0);
        this.board[7][0] = this.createIndividualPiece("bRook", 7, 0);
        
        this.board[0][1] = this.createIndividualPiece("bPawn", 0, 1);
        this.board[1][1] = this.createIndividualPiece("bPawn", 1, 1);
        this.board[2][1] = this.createIndividualPiece("bPawn", 2, 1);
        this.board[3][1] = this.createIndividualPiece("bPawn", 3, 1);
        this.board[4][1] = this.createIndividualPiece("bPawn", 4, 1);
        this.board[5][1] = this.createIndividualPiece("bPawn", 5, 1);
        this.board[6][1] = this.createIndividualPiece("bPawn", 6, 1);
        this.board[7][1] = this.createIndividualPiece("bPawn", 7, 1);

        // 1.2. White
        this.board[0][7] = this.createIndividualPiece("wRook", 0, 7);
        this.board[1][7] = this.createIndividualPiece("wKnight", 1, 7);
        this.board[2][7] = this.createIndividualPiece("wBishop", 2, 7);
        this.board[3][7] = this.createIndividualPiece("wQueen", 3, 7);
        this.board[4][7] = this.createIndividualPiece("wKing", 4, 7);
        this.board[5][7] = this.createIndividualPiece("wBishop", 5, 7);
        this.board[6][7] = this.createIndividualPiece("wKnight", 6, 7);
        this.board[7][7] = this.createIndividualPiece("wRook", 7, 7);
        
        this.board[0][6] = this.createIndividualPiece("wPawn", 0, 6);
        this.board[1][6] = this.createIndividualPiece("wPawn", 1, 6);
        this.board[2][6] = this.createIndividualPiece("wPawn", 2, 6);
        this.board[3][6] = this.createIndividualPiece("wPawn", 3, 6);
        this.board[4][6] = this.createIndividualPiece("wPawn", 4, 6);
        this.board[5][6] = this.createIndividualPiece("wPawn", 5, 6);
        this.board[6][6] = this.createIndividualPiece("wPawn", 6, 6);
        this.board[7][6] = this.createIndividualPiece("wPawn", 7, 6);

        // Drag and click event
        this.input.on("gameobjectup", function(pointer, gameObject){
            gameObject.emit("clicked", gameObject);
        }, this)

        this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
            
            dragX = Phaser.Math.Snap.To(dragX, this.tileSize);
            dragY = Phaser.Math.Snap.To(dragY, this.tileSize);

            gameObject.setPosition(dragX, dragY);
        })
    }

    clickEvent(obj: Phaser.GameObjects.GameObject){
        //console.log(obj)
        // obj.setInteractive({ draggable: true })
    }

    createIndividualPiece(spriteUrl: string, x: number, y: number, name?: string) : GameObjects.Sprite {
        return this.add
        .sprite(x * this.tileSize, y * this.tileSize, spriteUrl, 1)
        .setOrigin(0, 0)
        .setScale(3)
        // .setName(name)
        .setInteractive({ draggable: true, cursor: "pointer" })
        .on("clicked", this.clickEvent, this)
        .on("pointerover", function(){ this.setTint(0x98DEC7) })
        .on("pointerout", function(){ this.clearTint() })
        ;
    }

    update(){
        // const test = this.cursor;
    }
}
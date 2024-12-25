import { Scene } from "phaser";
import bg from "../../assets/ChessBoard.png"
import wPawn from "../../assets/Chess - white casual/Pawn.png"
import wKing from "../../assets/Chess - white casual/King.png"

export class MainGame extends Scene{
    /**
     *
     */
    private tileSize: number;

    constructor() {
        super();
        this.tileSize = 96;
    }

    preload(){
        this.load.image("bg", bg);
        this.load.image("wPawn", wPawn);

        // this.cursor = this.input.keyboard?.createCursorKeys();
    }

    create(){

        // 128 x 128 => 768 x 768
        // each square is 96 x 96
        this.add.image(0, 0, "bg").setOrigin(0, 0).setScale(6);
        // 32 x 32 => 96 x 96
        this.add
            .image(0, this.tileSize, "wPawn")
            .setOrigin(0, 0)
            .setScale(3)
            .setName("wPawn")
            .setInteractive()
            .on("clicked", this.clickEvent, this);

        this.input.on("gameobjectup", function(pointer, gameObj){
            gameObj.emit("clicked", gameObj);
        }, this)
    }

    clickEvent(obj){
        console.log(obj)
    }

    update(){
        // const test = this.cursor;
    }
}
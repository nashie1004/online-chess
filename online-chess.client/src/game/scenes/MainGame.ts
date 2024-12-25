import { GameObjects, Scene } from "phaser";
import bg from "../../assets/ChessBoard.png"
import wPawn from "../../assets/Chess - white casual/Pawn.png"
import wKing from "../../assets/Chess - white casual/King.png"

export class MainGame extends Scene{
    /**
     *
     */
    private tileSize: number;
    private board: (null | GameObjects.Sprite)[][]

    constructor() {
        super();
        this.tileSize = 96;
        this.board = [
            [this.add.sprite(0, 0, "")]
        ]
    }

    preload(){
        this.load.image("bg", bg);
        this.load.spritesheet("wPawn", wPawn, { frameWidth: 96, frameHeight: 96 });

        // this.cursor = this.input.keyboard?.createCursorKeys();
    }

    create(){

        // 128 x 128 => 768 x 768
        // each square is 96 x 96
        this.add.image(0, 0, "bg").setOrigin(0, 0).setScale(6);
        // 32 x 32 => 96 x 96
        this.add
            .sprite(0, this.tileSize, "wPawn")
            .setOrigin(0, 0)
            .setScale(3)
            .setName("wPawn")
            .setInteractive({ draggable: true, cursor: "pointer" })
            .on("clicked", this.clickEvent, this)
            .on("pointerover", function(e){ this.setTint(0x98DEC7) })
            .on("pointerout", function(e){ this.clearTint() })
            ;

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
        console.log(obj)
        // obj.setInteractive({ draggable: true })
    }

    update(){
        // const test = this.cursor;
    }
}
import { useEffect, useRef, useState } from "react"
import { MainGame } from "./scenes/MainGame";
import { gameOptions } from "./utils/constants";
import { eventEmitter } from "./eventEmitter";

export default function App(){
    const gameRef = useRef<Phaser.Game | null>();
    const [isWhitesTurn, setIsWhitesTurn] = useState(true);
    const [moveHistory, setMoveHistory] = useState([]);

    useEffect(() => {

        // start phaser
        if (!gameRef.current){
            gameRef.current = new Phaser.Game({
                type: Phaser.AUTO,
                width: gameOptions.width,
                height: gameOptions.height,
                parent: 'game-container',
                backgroundColor: '#028af8',
                scene: [ MainGame ],
            });
        }

        eventEmitter.on("isWhitesTurn", function(yes: boolean){
            setIsWhitesTurn(yes);
        })

        // cleanup phaser
        return () => {
            if (gameRef.current){
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, [])
 
    return <div id="app">
        <main className="game-container" id="game-container"> 

        </main>
        <aside>
            <h3>{isWhitesTurn ? "White's" : "Black's"} turn to move.</h3>
            <h3>Move History</h3>
            <ul>
                <li>Lorem ipsum dolor sit amet.</li>
                <li>Voluptatibus odit nostrum reiciendis laborum!</li>
                <li>Atque, quasi quod. Rerum, tenetur!</li>
            </ul>
            <h3>Capture History</h3>
            <ul>
                <li>Lorem ipsum dolor sit amet.</li>
                <li>Voluptatibus odit nostrum reiciendis laborum!</li>
                <li>Atque, quasi quod. Rerum, tenetur!</li>
            </ul>
            <h3>Chat</h3>
            <ul>
                <li>Lorem ipsum dolor sit amet.</li>
                <li>Voluptatibus odit nostrum reiciendis laborum!</li>
                <li>Atque, quasi quod. Rerum, tenetur!</li>
            </ul>
            <div>
                <button>Resign</button>
                <button>Request a Draw</button>
            </div>
        </aside>
    </div>
}
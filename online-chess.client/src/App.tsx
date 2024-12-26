import { useEffect, useRef, useState } from "react"
import { MainGame } from "./scenes/MainGame";
import { gameOptions } from "./utils/constants";
import { eventEmitter } from "./eventEmitter";
import { ICaptureHistory, IMoveHistory } from "./utils/types";
import Sidebar from "./components/Sidebar";
import Chatbar from "./components/Chatbar";

export default function App(){
    const gameRef = useRef<Phaser.Game | null>();
    const [isWhitesTurn, setIsWhitesTurn] = useState(true);
    const [moveHistory, setMoveHistory] = useState<IMoveHistory>({ white: [], black: [] });
    const [captureHistory, setCaptureHistory] = useState<ICaptureHistory>({ white: [], black: [] });

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

        eventEmitter.on("setIsWhitesTurn", (data: boolean) => setIsWhitesTurn(data))
        // eventEmitter.on("setMoveHistory", (data: IMoveHistory) => setMoveHistory(data))
        // eventEmitter.on("setCaptureHistory", (data: ICaptureHistory) => setCaptureHistory(data))

        // cleanup phaser
        return () => {
            if (gameRef.current){
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, [])
 
    return <div id="app">
        <Sidebar
            isWhitesTurn={isWhitesTurn}
            moveHistory={moveHistory}
            captureHistory={captureHistory}
          />
        <main className="game-container" id="game-container"> 

        </main>
        <Chatbar
            
        />
    </div>
}
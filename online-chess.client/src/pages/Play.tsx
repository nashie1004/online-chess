import { useEffect, useRef, useState } from "react"
import { MainGameScene } from "../phaser/MainGameScene";

import { gameOptions } from "../utils/constants";
import { eventEmitter } from "../phaser/eventEmitter";
import Sidebar from "../components/Sidebar";
import Chatbar from "../components/Chatbar";
import usePhaser from "../hooks/usePhaser";

export default function Main(){
    const gameRef = useRef<Phaser.Game | null>();
    const {
        isWhitesTurn, setIsWhitesTurn,
        moveHistory,
        captureHistory
    } = usePhaser();

    useEffect(() => {

        // start phaser
        if (!gameRef.current){
            gameRef.current = new Phaser.Game({
                type: Phaser.AUTO,
                width: gameOptions.width,
                height: gameOptions.height,
                parent: 'game-container',
                backgroundColor: '#028af8',
                scene: [ MainGameScene, ],
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
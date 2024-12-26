import { useEffect, useRef, useState } from "react"
import { MainGame } from "./scenes/MainGame";
import { gameOptions } from "./utils/constants";
import { eventEmitter } from "./eventEmitter";
import { ICaptureHistory, IMoveHistory } from "./utils/types";

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
        eventEmitter.on("setMoveHistory", (data: IMoveHistory) => setMoveHistory(data))
        eventEmitter.on("setCaptureHistory", (data: ICaptureHistory) => setCaptureHistory(data))

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
            <hr />
            <h3>Move History</h3>
            <h5>White</h5>
            <ul>
                {moveHistory.white.map((move, idx) => {
                    return <li key={idx}>
                        <span>Old: {move.new.pieceName} - {move.new.x} - {move.new.y}</span>
                        <span>, New: {move.old.pieceName} - {move.old.x} - {move.old.y}</span>
                    </li>
                })}
            </ul>
            <h5>Black</h5>
            <ul>
                {moveHistory.black.map((move, idx) => {
                    return <li key={idx}>
                        <span>Old: {move.new.pieceName} - {move.new.x} - {move.new.y}</span>
                        <span>, New: {move.old.pieceName} - {move.old.x} - {move.old.y}</span>
                    </li>
                })}
            </ul>
            <hr />
            <h3>Capture History</h3>
            <h5>White</h5>
            <ul>
                {captureHistory.white.map((capture, idx) => {
                    return <li key={idx}>
                        {capture.pieceName} - {capture.x} - {capture.y}
                    </li>
                })}
            </ul>
            <h5>Black</h5>
            <ul>
                {captureHistory.black.map((capture, idx) => {
                    return <li key={idx}>
                        {capture.pieceName} - {capture.x} - {capture.y}
                    </li>
                })}
            </ul>
            <hr />
            <h3>Chat</h3>
            <div>
                <button>Resign</button>
                <button>Request a Draw</button>
            </div>
        </aside>
    </div>
}
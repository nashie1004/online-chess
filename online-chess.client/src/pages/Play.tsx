import { useEffect, useRef } from "react"
import { MainGameScene } from "../phaser/MainGameScene";

import { gameOptions } from "../utils/constants";
import { eventEmitter } from "../phaser/eventEmitter";
import SidebarLeft from "../components/SidebarLeft";
import usePhaser from "../hooks/usePhaser";
import { IMoveHistory , ICaptureHistory, IKingState} from "../utils/types";
import SidebarRight from "../components/SidebarRight";

export default function Main(){
    const gameRef = useRef<Phaser.Game | null>();
    const {
        setIsWhitesTurn
        , setMoveHistory
        , setCaptureHistory
        , setKingsState
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
        eventEmitter.on("setMoveHistory", (data: IMoveHistory) => setMoveHistory(data))
        eventEmitter.on("setCaptureHistory", (data: ICaptureHistory) => setCaptureHistory(data))
        eventEmitter.on("setKingsState", (data: IKingState) => setKingsState(data))

        // cleanup phaser
        return () => {
            if (gameRef.current){
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, [])
 
    return <div id="app"> 
        <SidebarLeft />
        <main id="game-container" className="d-flex justify-content-center align-items-center">
        </main>
        <SidebarRight />
    </div>
}
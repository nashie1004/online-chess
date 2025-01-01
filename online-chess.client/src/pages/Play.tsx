import { useEffect, useRef } from "react"

import { Options as gameOptions } from "../game/utilities/constants";
import { eventEmitter } from "../game/utilities/eventEmitter";
import SidebarLeft from "../components/SidebarLeft";
import usePhaser from "../hooks/usePhaser";
import { IMoveHistory , ICaptureHistory, IKingState} from "../game/utilities/types";
import SidebarRight from "../components/SidebarRight";
import { MainGameScene } from "../game/scenes/MainGameScene";

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
 
    return <div className="flex"> 
        <SidebarLeft />
        <main id="game-container" style={{ maxWidth: "800px" }}>
          
        </main>
        <SidebarRight />
    </div>
}
import { useEffect, useRef } from "react"

import { Options as gameOptions } from "../game/utilities/constants";
import { eventEmitter } from "../game/utilities/eventEmitter";
import usePhaserContext from "../hooks/usePhaserContext";
import { IMoveHistory , ICaptureHistory, IKingState} from "../game/utilities/types";
import SidebarRight from "../components/SidebarRight";
import { MainGameScene } from "../game/scenes/MainGameScene";
import SignalRConnection from "../services/SignalRService";
import CaptureHistory from "../components/CaptureHistory";
import { useParams, useSearchParams } from "react-router";

export default function Main(){
    const gameRef = useRef<Phaser.Game | null>();
    const {
        setIsWhitesTurn
        , setMoveHistory
        , setCaptureHistory
        , setKingsState
    } = usePhaserContext();
    const test = useParams();

    console.log(test)

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

        // test real time connection
        
        const connection = new SignalRConnection();
        async function start() {
            await connection.startConnection((e) => console.log(e));

            await connection.addHandler("NewlyConnected", (user, message) => {
                console.log('NewlyConnected: ', user, message)
            });
            
            await connection.addHandler("Disconnected", (user, message) => {
                console.log('Disconnected: ', user, message)
            });
            
            await connection.addHandler("TestClientResponse", (user, message) => {
                console.log('TestClientResponse: ', user, message)
            });

            await connection.invoke("JoinRoom", "TestUser", "Hello World")
        }

        start();
        

        // cleanup phaser
        return () => {
            if (gameRef.current){
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
            
            connection.stopConnection();
        };
    }, [])
 
    return <> 
        {/* <SidebarLeft /> */}
        <div className="col-auto pt-2">
            <div id="game-container" style={{ maxWidth: "800px" }}>
            
            </div>
            <CaptureHistory />
        </div>
        <div className="col">
            <SidebarRight />
        </div>
    </>
}
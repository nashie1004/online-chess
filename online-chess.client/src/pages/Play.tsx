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

const connection = new SignalRConnection();

export default function Main(){
    const gameRef = useRef<Phaser.Game | null>();
    const {
        setIsWhitesTurn
        , setMoveHistory
        , setCaptureHistory
        , setKingsState
    } = usePhaserContext();
    const url = useParams();

    useEffect(() => {
        async function start() {
            await connection.startConnection((e) => console.log(e));
            await connection.addHandler("GetRoomData", (data) => {
                console.log(data)
            })
            await connection.invoke("JoinRoom", url.gameRoomId);

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

        }

        start();

        return () => {
            // cleanup phaser
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
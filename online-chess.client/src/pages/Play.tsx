import { useEffect, useRef } from "react"

import { Options as gameOptions } from "../game/utilities/constants";
import { eventEmitter } from "../game/utilities/eventEmitter";
import SidebarLeft from "../components/SidebarLeft";
import usePhaser from "../hooks/usePhaser";
import { IMoveHistory , ICaptureHistory, IKingState} from "../game/utilities/types";
import SidebarRight from "../components/SidebarRight";
import { MainGameScene } from "../game/scenes/MainGameScene";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import SignalRConnection from "../services/SignalRService";
import PlayerInfo from "../components/PlayerInfo";
import CaptureHistory from "../components/CaptureHistory";

export default function Main(){
    const gameRef = useRef<Phaser.Game | null>();
    const {
        setIsWhitesTurn
        , setMoveHistory
        , setCaptureHistory
        , setKingsState
    } = usePhaser();

    async function startConnection() {
        const connection = new HubConnectionBuilder()
            .withUrl("https://localhost:44332/hub")
            .configureLogging(LogLevel.Information)
            .build();
        ;
        connection.on("ReceiveMessage", (user, message) => {
            console.log(user + " says " + message); 
        })
        try {
            await connection.start();
            //await connection.invoke("TestMessage", "todo")
            console.log("Connection started");
        } catch (error) {
            console.log(error);
        }

        await connection.invoke("SendMessage", "hi")
    }

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
            await connection.startConnection();

            await connection.addHandler("TestClientResponse", (user, message) => {
                console.log('TestClientResponse', user, message)
            });

            await connection.invoke("JoinRoom", "joining room")
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
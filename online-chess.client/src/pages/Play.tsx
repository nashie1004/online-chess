import { useEffect, useRef, useState } from "react"
import { GameStatus } from "../game/utilities/constants";
import { eventEmitter } from "../game/utilities/eventEmitter";
import { IChat, IPieceMove } from "../game/utilities/types";
import SidebarRight from "../components/play/SidebarRight";
import CaptureHistory from "../components/play/CaptureHistory";
import { useParams } from "react-router";
import useGameContext from "../hooks/useGameContext";
import useSignalRContext from "../hooks/useSignalRContext";
import OutcomeModal from "../components/play/OutcomeModal";
import useOnInitializeGameInfo from "../game/signalRhandlers/useOnInitializeGameInfo";
import useOnUpdateBoard from "../game/signalRhandlers/useOnUpdateBoard";
import useOpponentDrawRequest from "../game/signalRhandlers/useOpponentDrawRequest";
import useOnNotFound from "../game/signalRhandlers/useOnNotFound";
import useOnReceiveMessages from "../game/signalRhandlers/useOnReceiveMessages";
import useOnOpponentPieceMoved from "../game/signalRhandlers/useOnOpponentPieceMoved";

export default function Main(){
    const gameRef = useRef<Phaser.Game | null>();
    const signalRConnectionRef = useRef<boolean | null>(null);
    const { setGameState } = useGameContext();
    const { startConnection, addHandler, invoke, removeHandler, stopConnection } = useSignalRContext();
    const url = useParams();
    const [gameOutcome, setGameOutcome] = useState<GameStatus | null>(null);
    
    const onInitializeGameInfo = useOnInitializeGameInfo(gameRef);
    const onUpdateBoard = useOnUpdateBoard();
    const onOpponentDrawRequest = useOpponentDrawRequest();
    const onNotFound = useOnNotFound();
    const onReceiveMessages = useOnReceiveMessages();
    const onOpponentPieceMoved = useOnOpponentPieceMoved();

    useEffect(() => {
        async function start() {
            await startConnection(_ => {});
            signalRConnectionRef.current = true;

            await addHandler("onNotFound", onNotFound);
            await addHandler("onInitializeGameInfo", onInitializeGameInfo);
            await addHandler("onGameOver", (outcome: GameStatus) => setGameOutcome(outcome));
            await addHandler("onReceiveMessages", onReceiveMessages);
            await addHandler("onOpponentPieceMoved", onOpponentPieceMoved);
            await addHandler("onUpdateBoard", onUpdateBoard)
            await addHandler("onOpponentDrawRequest", onOpponentDrawRequest)

            await invoke("GameStart", url.gameRoomId);
        }

        if (!signalRConnectionRef.current){
            console.info("Game Start")
            start();
        }

        return () => {
            // cleanup phaser
            if (gameRef.current){
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
            
            removeHandler("onNotFound");
            removeHandler("onInitializeGameInfo");
            removeHandler("onGameOver");
            removeHandler("onReceiveMessages");
            removeHandler("onOpponentPieceMoved");
            removeHandler("onUpdateMoveHistory");
            stopConnection();
        };
    }, [])

    //console.log("render")
 
    return <> 
        <div className="col-auto pt-2">
            <div id="game-container" style={{ maxWidth: "800px" }}>
            
            </div>
            <CaptureHistory />
        </div>
        <div className="col">
            <SidebarRight />
        </div>
        <OutcomeModal outcome={gameOutcome} />
    </>
}
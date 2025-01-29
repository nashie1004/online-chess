import { useEffect, useRef } from "react"
import SidebarRight from "../components/play/SidebarRight";
import CaptureHistory from "../components/play/CaptureHistory";
import { useParams } from "react-router";
import useSignalRContext from "../hooks/useSignalRContext";
import OutcomeModal from "../components/play/OutcomeModal";
import useOnInitializeGameInfo from "../game/signalRhandlers/useOnInitializeGameInfo";
import useOnUpdateBoard from "../game/signalRhandlers/useOnUpdateBoard";
import useOpponentDrawRequest from "../game/signalRhandlers/useOpponentDrawRequest";
import useOnNotFound from "../game/signalRhandlers/useOnNotFound";
import useOnReceiveMessages from "../game/signalRhandlers/useOnReceiveMessages";
import useOnOpponentPieceMoved from "../game/signalRhandlers/useOnOpponentPieceMoved";
import useOnGameOver from "../game/signalRhandlers/useOnGameOver";
import useGameContext from "../hooks/useGameContext";
import GameLoading from "../components/play/GameLoading";

export default function Main(){
    const gameRef = useRef<Phaser.Game | null>();
    const signalRConnectionRef = useRef<boolean | null>(null);
    const { startConnection, addHandler, invoke, removeHandler, stopConnection } = useSignalRContext();
    const url = useParams();
    const { setGameState, gameState } = useGameContext();
    
    const onInitializeGameInfo = useOnInitializeGameInfo(gameRef);
    const onUpdateBoard = useOnUpdateBoard();
    const onOpponentDrawRequest = useOpponentDrawRequest();
    const onNotFound = useOnNotFound();
    const onReceiveMessages = useOnReceiveMessages();
    const onOpponentPieceMoved = useOnOpponentPieceMoved();
    const onGameOver = useOnGameOver();

    useEffect(() => {
        setGameState({ type: "SET_CLEARGAMESTATE" });
        setGameState({ type: "SET_GAMESTATUS", payload: "LOADING" });

        async function start() {
            await startConnection(_ => {});
            signalRConnectionRef.current = true;

            await addHandler("onNotFound", onNotFound);
            await addHandler("onInitializeGameInfo", onInitializeGameInfo);
            await addHandler("onGameOver", onGameOver);
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
            setGameState({ type: "SET_CLEARGAMESTATE" });

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

    //console.log("game state:", gameState)
 
    return <> 
        <div className="col-auto pt-2">
            <div id="game-container" style={{ maxWidth: "800px" }}>
            
            </div>
            <CaptureHistory />
        </div>
        <div className="col">
            <SidebarRight />
        </div>
        <OutcomeModal />
        <GameLoading />
    </>
}
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
import useOnGameOver from "../game/signalRhandlers/useOnGameOver";
import useGameContext from "../hooks/useGameContext";
import GameLoading from "../components/play/GameLoading";
import DrawRequestModal from "../components/play/DrawRequestModal";
import useOnDeclineDraw from "../game/signalRhandlers/useOnDeclineDraw";
import PromotionPicker from "../components/play/PromotionPickerModal";
import { playPageHandlers, playPageInvokers } from "../game/utilities/constants";
import useOnSetPromotionPreference from "../game/signalRhandlers/useOnSetPromotionPreference";
import useNotificationContext from "../hooks/useNotificationContext";

export default function Main(){
    const gameRef = useRef<Phaser.Game | null>();
    const { userConnectionId, addHandler, invoke, removeHandler } = useSignalRContext();
    const url = useParams();
    const { setGameState } = useGameContext();
    const { setNotificationState } = useNotificationContext();
    
    const onInitializeGameInfo = useOnInitializeGameInfo(gameRef);
    const onUpdateBoard = useOnUpdateBoard();
    const onOpponentDrawRequest = useOpponentDrawRequest();
    const onNotFound = useOnNotFound();
    const onReceiveMessages = useOnReceiveMessages();
    const onGameOver = useOnGameOver();
    const onDeclineDraw = useOnDeclineDraw();
    const onSetPromotionPreference = useOnSetPromotionPreference();

    useEffect(() => {
        setNotificationState({ type: "SET_RESETNOTIFICATIONS" });
        setGameState({ type: "SET_CLEARGAMESTATE" });
        setGameState({ type: "SET_GAMESTATUS", payload: "LOADING" });

        async function start() {
            await addHandler(playPageHandlers.onNotFound, onNotFound);
            await addHandler(playPageHandlers.onInitializeGameInfo, onInitializeGameInfo);
            await addHandler(playPageHandlers.onGameOver, onGameOver);
            await addHandler(playPageHandlers.onReceiveMessages, onReceiveMessages);
            await addHandler(playPageHandlers.onUpdateBoard, onUpdateBoard)
            await addHandler(playPageHandlers.onOpponentDrawRequest, onOpponentDrawRequest)
            await addHandler(playPageHandlers.onDeclineDraw, onDeclineDraw)
            await addHandler(playPageHandlers.onSetPromotionPreference, onSetPromotionPreference)

            await invoke(playPageInvokers.gameStart, url.gameRoomId);
        }

        if (userConnectionId){
            //console.info("Game Start")
            start();
        }

        return () => {
            setGameState({ type: "SET_CLEARGAMESTATE" });

            // cleanup phaser
            if (gameRef.current){
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
            
            removeHandler(playPageHandlers.onNotFound);
            removeHandler(playPageHandlers.onInitializeGameInfo);
            removeHandler(playPageHandlers.onGameOver);
            removeHandler(playPageHandlers.onReceiveMessages);
            removeHandler(playPageHandlers.onUpdateBoard);
            removeHandler(playPageHandlers.onOpponentDrawRequest);
            removeHandler(playPageHandlers.onDeclineDraw);
            removeHandler(playPageHandlers.onSetPromotionPreference);
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
        <DrawRequestModal />
        <PromotionPicker />
    </>
}
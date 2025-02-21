import { useEffect, useRef } from "react"
import SidebarRight from "../components/play/SidebarRight";
import CaptureHistory from "../components/play/CaptureHistory";
import { useSearchParams } from "react-router";
import useSignalRContext from "../hooks/useSignalRContext";
import OutcomeModal from "../components/play/OutcomeModal";
import useOnInitializeGameInfo from "../game/signalRhandlers/useOnInitializeGameInfo";
import useOnUpdateBoard from "../game/signalRhandlers/useOnUpdateBoard";
import useOpponentDrawRequest from "../game/signalRhandlers/useOpponentDrawRequest";
import useOnReceiveMessages from "../game/signalRhandlers/useOnReceiveMessages";
import useOnGameOver from "../game/signalRhandlers/useOnGameOver";
import useGameContext from "../hooks/useGameContext";
import GameLoading from "../components/play/GameLoading";
import DrawRequestModal from "../components/play/DrawRequestModal";
import useOnDeclineDraw from "../game/signalRhandlers/useOnDeclineDraw";
import PromotionPicker from "../components/play/PromotionPickerModal";
import useOnSetPromotionPreference from "../game/signalRhandlers/useOnSetPromotionPreference";
import useNotificationContext from "../hooks/useNotificationContext";
import useQueuingContext from "../hooks/useQueuingContext";
import { PLAY_PAGE_INVOKERS } from "../constants/invokers";
import { PLAY_PAGE_HANDLERS } from "../constants/handlers";

export default function Main(){
    const gameRef = useRef<Phaser.Game | null>();
    const { userConnectionId, addHandler, invoke, removeHandler } = useSignalRContext();
    const { setGameState } = useGameContext();
    const { setNotificationState } = useNotificationContext();
    const { setQueuingRoomKey } = useQueuingContext();
    const [searchParams] = useSearchParams();
    
    const onInitializeGameInfo = useOnInitializeGameInfo(gameRef);
    const onUpdateBoard = useOnUpdateBoard();
    const onOpponentDrawRequest = useOpponentDrawRequest();
    const onReceiveMessages = useOnReceiveMessages();
    const onGameOver = useOnGameOver();
    const onDeclineDraw = useOnDeclineDraw();
    const onSetPromotionPreference = useOnSetPromotionPreference();

    useEffect(() => {
        setQueuingRoomKey(null);
        setNotificationState({ type: "SET_RESETNOTIFICATIONS" });
        setGameState({ type: "SET_CLEARGAMESTATE" });
        setGameState({ type: "SET_GAMESTATUS", payload: "LOADING" });

        if (!userConnectionId) return;

        async function start() {
            await addHandler(PLAY_PAGE_HANDLERS.ON_INITIALIZE_GAME_INFO, onInitializeGameInfo);
            await addHandler(PLAY_PAGE_HANDLERS.ON_GAME_OVER, onGameOver);
            await addHandler(PLAY_PAGE_HANDLERS.ON_RECEIVER_MESSAGES, onReceiveMessages);
            await addHandler(PLAY_PAGE_HANDLERS.ON_UPDATE_BOARD, onUpdateBoard)
            await addHandler(PLAY_PAGE_HANDLERS.ON_OPPONENT_DRAW_REQUEST, onOpponentDrawRequest)
            await addHandler(PLAY_PAGE_HANDLERS.ON_DECLINE_DRAW, onDeclineDraw)
            await addHandler(PLAY_PAGE_HANDLERS.ON_SET_PROMOTION_PREFERENCE, onSetPromotionPreference)

            await invoke(PLAY_PAGE_INVOKERS.GAME_START, searchParams.get("gameRoomKey"), searchParams.get("reconnect") === "true");
        }

        start();

        return () => {
            setGameState({ type: "SET_CLEARGAMESTATE" });

            // cleanup phaser
            if (gameRef.current){
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
            
            removeHandler(PLAY_PAGE_HANDLERS.ON_INITIALIZE_GAME_INFO);
            removeHandler(PLAY_PAGE_HANDLERS.ON_GAME_OVER);
            removeHandler(PLAY_PAGE_HANDLERS.ON_RECEIVER_MESSAGES);
            removeHandler(PLAY_PAGE_HANDLERS.ON_UPDATE_BOARD);
            removeHandler(PLAY_PAGE_HANDLERS.ON_OPPONENT_DRAW_REQUEST);
            removeHandler(PLAY_PAGE_HANDLERS.ON_DECLINE_DRAW);
            removeHandler(PLAY_PAGE_HANDLERS.ON_SET_PROMOTION_PREFERENCE);
        };
    }, [])
 
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
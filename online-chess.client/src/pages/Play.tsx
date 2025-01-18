import { useCallback, useEffect, useRef } from "react"
import { Options as gameOptions } from "../game/utilities/constants";
import { eventEmitter } from "../game/utilities/eventEmitter";
import usePhaserContext from "../hooks/usePhaserContext";
import { IMoveHistory , ICaptureHistory, IKingState, IInitialGameInfo, IChat} from "../game/utilities/types";
import SidebarRight from "../components/play/SidebarRight";
import { MainGameScene } from "../game/scenes/MainGameScene";
import CaptureHistory from "../components/play/CaptureHistory";
import { useLocation, useNavigate, useParams } from "react-router";
import useGameContext from "../hooks/useGameContext";
import useSignalRContext from "../hooks/useSignalRContext";

/*
 setMessages(prev => ([...prev, { 
    createDate: new Date(moment().format()) 
    , createdByUserId: 999
    , message: data
}]));
*/

export default function Main(){
    const gameRef = useRef<Phaser.Game | null>();
    const {
        setIsWhitesTurn
        , setMoveHistory
        , setCaptureHistory
        , setKingsState
        , moveHistory
    } = usePhaserContext();
    const { setMessages, setGameRoomKey } = useGameContext();
    const navigate = useNavigate();
    const signalRContext = useSignalRContext();
    const url = useParams();

    const initPhaser = useCallback((initGameInfo: IInitialGameInfo) => {
        // init base state
        setMessages(initGameInfo.messages);
        setGameRoomKey(initGameInfo.gameRoomKey);

        // init phaser
        if (!gameRef.current){
            gameRef.current = new Phaser.Game({
                type: Phaser.AUTO,
                width: gameOptions.width,
                height: gameOptions.height,
                parent: 'game-container',
                backgroundColor: '#028af8',
                scene: [
                    new MainGameScene("mainChessboard", initGameInfo.isColorWhite)
                ],
            });
        }

        // connect react and phaser
        eventEmitter.on("setIsWhitesTurn", (data: boolean) => setIsWhitesTurn(data));
        eventEmitter.on("setMoveHistory", (data: IMoveHistory) => setMoveHistory(data));
        eventEmitter.on("setCaptureHistory", (data: ICaptureHistory) => setCaptureHistory(data));
        eventEmitter.on("setKingsState", (data: IKingState) => setKingsState(data));
    }, []);
    
    useEffect(() => {
        async function start() {
            await signalRContext.startConnection(_ => {});

            await signalRContext.addHandler("NotFound", _ => navigate("/notFound"));
            await signalRContext.addHandler("InitializeGameInfo", initPhaser);
            await signalRContext.addHandler("ReceiveMessages", (messages: IChat[]) => setMessages(messages));

            await signalRContext.invoke("GameStart", url.gameRoomId);
        }

        start();

        return () => {
            // cleanup phaser
            if (gameRef.current){
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
            
            signalRContext.stopConnection();
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
    </>
}
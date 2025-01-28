import { useEffect, useRef, useState } from "react"
import { GameStatus } from "../game/utilities/constants";
import { eventEmitter } from "../game/utilities/eventEmitter";
import usePhaserContext from "../hooks/usePhaserContext";
import { IChat, IPieceMove } from "../game/utilities/types";
import SidebarRight from "../components/play/SidebarRight";
import CaptureHistory from "../components/play/CaptureHistory";
import { useNavigate, useParams } from "react-router";
import useGameContext from "../hooks/useGameContext";
import useSignalRContext from "../hooks/useSignalRContext";
import OutcomeModal from "../components/play/OutcomeModal";
import useInitializePhaser from "../game/signalRhandlers/useInitializePhaser";
import useUpdateBoard from "../game/signalRhandlers/useUpdateBoard";

export default function Main(){
    const gameRef = useRef<Phaser.Game | null>();
    const { } = usePhaserContext();
    const { setGameState } = useGameContext();
    const navigate = useNavigate();
    const { startConnection, addHandler, invoke, removeHandler, stopConnection } = useSignalRContext();
    const url = useParams();
    const signalRConnectionRef = useRef<boolean | null>(null);
    const [gameOutcome, setGameOutcome] = useState<GameStatus | null>(null);
    const initPhaser = useInitializePhaser(gameRef);
    const updateBoard = useUpdateBoard();

    useEffect(() => {
        async function start() {
            await startConnection(_ => {});
            signalRConnectionRef.current = true;

            await addHandler("onNotFound", _ => navigate("/notFound"));
            await addHandler("onInitializeGameInfo", initPhaser);
            await addHandler("onGameOver", (outcome: GameStatus) => setGameOutcome(outcome));
            await addHandler("onReceiveMessages", (messages: IChat[]) => setGameState({ type: "SET_MESSAGES", payload: messages }));
            await addHandler("onOpponentPieceMoved", (data) => eventEmitter.emit("setEnemyMove", data.moveInfo as IPieceMove));
            await addHandler("onUpdateBoard", updateBoard)

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
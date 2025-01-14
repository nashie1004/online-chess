import { useEffect, useRef } from "react"
import { Options as gameOptions } from "../game/utilities/constants";
import { eventEmitter } from "../game/utilities/eventEmitter";
import usePhaserContext from "../hooks/usePhaserContext";
import { IMoveHistory , ICaptureHistory, IKingState} from "../game/utilities/types";
import SidebarRight from "../components/SidebarRight";
import { MainGameScene } from "../game/scenes/MainGameScene";
import CaptureHistory from "../components/CaptureHistory";
import { useLocation, useNavigate, useParams } from "react-router";
import useGameContext from "../hooks/useGameContext";
import useSignalRContext from "../hooks/useSignalRContext";

export default function Main(){
    const gameRef = useRef<Phaser.Game | null>();
    const {
        setIsWhitesTurn
        , setMoveHistory
        , setCaptureHistory
        , setKingsState
    } = usePhaserContext();
    const { setMessages } = useGameContext();
    const navigate = useNavigate();
    const signalRContext = useSignalRContext();
    const url = useParams();

    useEffect(() => {
        async function start() {
            await signalRContext.startConnection((e) => console.log(e));

            await signalRContext.addHandler("NotFound", _ => navigate("/notFound"));

            console.log(url)
            await signalRContext.invoke("GameStart", url.gameRoomId);

            /*
            await signalRContext.addHandler("GetRoomData", (data) => {
                setMessages(prev => ([...prev, { 
                    createDate: new Date(moment().format()) 
                    , createdByUserId: 999
                    , message: data
                }]));
            })
            
            await signalRContext.addHandler("LeaveRoom", (data) => {
                setMessages(prev => ([...prev, { 
                    createDate: new Date(moment().format()) 
                    , createdByUserId: 999
                    , message: data
                }]));
            });
            */

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
            
            signalRContext.stopConnection();
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
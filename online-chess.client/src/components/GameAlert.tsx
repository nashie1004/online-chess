import { Spinner } from "react-bootstrap";
import useNotificationContext from "../hooks/useNotificationContext"
import useSignalRContext from "../hooks/useSignalRContext";
import { mainPageInvokers } from "../game/utilities/constants";
import useGameContext from "../hooks/useGameContext";

export default function GameAlert(){
    const { notificationState, setNotificationState } = useNotificationContext();
    const { invoke } = useSignalRContext();
    const { gameState } = useGameContext();

    if (
        !notificationState.customMessage &&
        !notificationState.signalRConnectionDisconnected &&
        !notificationState.gameQueuingRoomKey &&
        !notificationState.hasAGameOnGoing &&
        !notificationState.hasAGameDisconnected
    ){
        return <></>;
    }

    function gameNotif(){

        if (notificationState.signalRConnectionDisconnected){
            return <>
                <i className="bi bi-exclamation-circle-fill"></i>
                <span className="ps-1">Unable to establish real time connection with the server. 
                    <a 
                        href="#" 
                        className="ps-1 alert-link"
                        onClick={() => {
                            alert("todo")
                        }}
                    >Retry?</a>
                </span>
            </> 
        }

        if (notificationState.gameQueuingRoomKey){
            return <>
                <Spinner size="sm" animation="border" variant="dark" /> 
                <span className="ps-2">
                    You have a game queuing... 
                    <a 
                        href="#" 
                        className="ps-1 alert-link"
                        onClick={() => {
                            invoke(mainPageInvokers.deleteRoom, notificationState.gameQueuingRoomKey);
                            setNotificationState({ type: "SET_GAMEQUEUINGROOMKEY", payload: null });
                        }}
                        >Stop queuing?</a> 
                </span>
            </>
        }

        if (notificationState.hasAGameOnGoing){
            return <>TODO</>
        }

        if (notificationState.hasAGameDisconnected){
            return <>TODO</>
        }

        return <></>
    }

    return <>
        <div className="sticky-sm-top alert alert-warning" role="alert">
            <div className="container">
                {gameNotif()}
            </div>
        </div>
    </>
}
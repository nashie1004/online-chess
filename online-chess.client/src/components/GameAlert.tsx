import { Spinner } from "react-bootstrap";
import useNotificationContext from "../hooks/useNotificationContext"
import useSignalRContext from "../hooks/useSignalRContext";
import { mainPageInvokers } from "../game/utilities/constants";
// import useGameContext from "../hooks/useGameContext";
import useQueuingContext from "../hooks/useQueuingContext";

export default function GameAlert(){
    const { notificationState, setNotificationState } = useNotificationContext();
    const { invoke } = useSignalRContext();
    // const { gameState } = useGameContext();
    const { setQueuingRoomKey, queuingRoomKey } = useQueuingContext();

    if (
        !notificationState.customMessage &&
        !notificationState.signalRConnectionDisconnected &&
        !notificationState.hasAGameQueuing &&
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

        if (notificationState.customMessage){
            let icon = "bi bi-check2";

            switch(notificationState.customMessageType){
                case "SUCCESS":
                    icon = "bi bi-check2";
                    break;
                case "DANGER":
                    icon = "bi bi-exclamation-circle-fill";
                    break;
                case "INFO":
                    icon = "bi bi-exclamation-circle-fill";
                    break;
            }

            return <>
                <i className={icon}></i>
                <span className="ps-2">
                    {notificationState.customMessage}
                </span>
            </>
        }

        if (notificationState.hasAGameQueuing || queuingRoomKey){
            return <>
                <Spinner size="sm" animation="border" variant="dark" /> 
                <span className="ps-2">
                    You have a game queuing... 
                    <a 
                        href="#" 
                        className="ps-1 alert-link"
                        onClick={() => {
                            setNotificationState({ type: "SET_HASAGAMEQUEUINGROOMKEY", payload: false });
                            setQueuingRoomKey(null);
                            invoke(mainPageInvokers.deleteRoom, queuingRoomKey);
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
                {notificationState.customMessage ? 
                <>"close btn todo"</> 
                : <></>}
            </div>
        </div>
    </>
}
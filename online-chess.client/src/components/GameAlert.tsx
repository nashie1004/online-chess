import { Spinner } from "react-bootstrap";
import useNotificationContext from "../hooks/useNotificationContext"
import useSignalRContext from "../hooks/useSignalRContext";
import { mainPageInvokers } from "../game/utilities/constants";
import useGameContext from "../hooks/useGameContext";
import { useState } from "react";

export default function GameAlert(){
    const { notificationState, setNotificationState } = useNotificationContext();
    const { invoke } = useSignalRContext();
    const { gameState } = useGameContext();
    const [showCloseBtn, setShowCloseBtn] = useState(false);

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
            setShowCloseBtn(false);
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
            setShowCloseBtn(true);
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

        if (notificationState.gameQueuingRoomKey){
            setShowCloseBtn(false);
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
            setShowCloseBtn(false);
            return <>TODO</>
        }

        if (notificationState.hasAGameDisconnected){
            setShowCloseBtn(false);
            return <>TODO</>
        }

        return <></>
    }

    return <>
        <div className="sticky-sm-top alert alert-warning" role="alert">
            <div className="container">
                {gameNotif()}
                {/* TODO CLOSE BTN */}
            </div>
        </div>
    </>
}
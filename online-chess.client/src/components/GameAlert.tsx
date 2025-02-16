import { Spinner } from "react-bootstrap";
import useNotificationContext from "../hooks/useNotificationContext"
import useSignalRContext from "../hooks/useSignalRContext";
import { mainPageInvokers } from "../game/utilities/constants";
// import useGameContext from "../hooks/useGameContext";
import useQueuingContext from "../hooks/useQueuingContext";
import useInitializerContext from "../hooks/useInitializerContext";

export default function GameAlert(){
    const { notificationState, setNotificationState } = useNotificationContext();
    const { invoke } = useSignalRContext();
    // const { gameState } = useGameContext();
    const { setQueuingRoomKey, queuingRoomKey } = useQueuingContext();
    const { setInitialize } = useInitializerContext();

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
                            setQueuingRoomKey(null);
                            setInitialize(true);
                        }}
                    >Reconnect and reauthenticate?</a>
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

        if (notificationState.hasAGameQueuing){
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
            return <>
                <i className="bi bi-exclamation-circle-fill"></i>
                <span className="ps-2">Disconnected from a game. TODO</span>
            </>
        }

        return <></>
    }

    return <>
        <div className="sticky-sm-top alert alert-warning" role="alert">
            <div className="container d-flex justify-content-between">
                <div>
                    {gameNotif()}
                </div>
                {notificationState.customMessage && <>
                    <button 
                        type="button" 
                        className="btn-close" 
                        aria-label="Close"
                        onClick={() => {
                            setNotificationState({ type: "SET_RESETNOTIFICATIONS" });
                        }}
                    />
                </>}
            </div>
        </div>
    </>
}
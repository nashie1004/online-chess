import { Spinner } from "react-bootstrap";
import useNotificationContext from "../hooks/useNotificationContext"
import useSignalRContext from "../hooks/useSignalRContext";
import useQueuingContext from "../hooks/useQueuingContext";
import useInitializerContext from "../hooks/useInitializerContext";
import { useNavigate } from "react-router";
import useGameContext from "../hooks/useGameContext";
import { MAIN_PAGE_INVOKERS } from "../constants/invokers";

export default function GameAlert(){
    const { notificationState, setNotificationState } = useNotificationContext();
    const { invoke } = useSignalRContext();
    const { setQueuingRoomKey, queuingRoomKey } = useQueuingContext();
    const { setInitialize } = useInitializerContext();
    const navigate = useNavigate();
    const { gameState } = useGameContext();

    if (
        !notificationState.customMessage &&
        !notificationState.signalRConnectionDisconnected &&
        !notificationState.hasAGameQueuing &&
        !notificationState.hasAGameOnGoing  && 
        !notificationState.hasMultipleTabsOpened
    ){
        return <></>;
    }

    function gameNotif(){
        let returnComponent: JSX.Element = <></>
        
        if (notificationState.hasMultipleTabsOpened){
            returnComponent = <div>
                {returnComponent}
                <i className="bi bi-exclamation-circle-fill"></i>
                <span className="ps-2">
                    You have multiple tabs opened.
                </span>
            </div>
        }
    
        if (notificationState.signalRConnectionDisconnected){
            returnComponent = <div>
                {returnComponent}
                <i className="bi bi-exclamation-circle-fill"></i>
                <span className="ps-2">Unable to establish real time connection with the server. 
                    <a 
                        href="#" 
                        className="ps-1 alert-link"
                        onClick={() => {
                            setQueuingRoomKey(null);
                            setInitialize(true);
                        }}
                    >Reconnect and reauthenticate?</a>
                </span>
            </div> 
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

            returnComponent = <div>
                {returnComponent}
                <i className={icon}></i>
                <span className="ps-2">
                    {notificationState.customMessage}
                </span>
            </div>
        }

        if (notificationState.hasAGameQueuing){
            returnComponent = <div>
                {returnComponent}
                <Spinner size="sm" animation="border" variant="dark" /> 
                <span className="ps-2">
                    You have a game queuing... 
                    <a 
                        href="#" 
                        className="ps-1 alert-link"
                        onClick={() => {
                            setNotificationState({ type: "SET_HASAGAMEQUEUINGROOMKEY", payload: false });
                            setQueuingRoomKey(null);
                            invoke(MAIN_PAGE_INVOKERS.DELETE_ROOM, queuingRoomKey);
                        }}
                        >Stop queuing?</a> 
                </span>
            </div>
        }

        if (notificationState.hasAGameOnGoing){
            returnComponent = <div>
                {returnComponent}
                <i className="bi bi-exclamation-circle-fill"></i>
                <span className="ps-2">
                    You have a game in-progress.

                    {!notificationState.hasMultipleTabsOpened && <>
                        <a 
                            href="#" 
                            className="ps-1 alert-link"
                            onClick={() => {
                                navigate(`/play?gameRoomKey=${gameState.gameRoomKey}&reconnect=true`);
                            }}>Resume.</a> 
                    </>}
                </span>
            </div>
        }
        
        return returnComponent;
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
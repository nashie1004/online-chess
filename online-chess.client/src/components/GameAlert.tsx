import { Spinner } from "react-bootstrap";
import useNotificationContext from "../hooks/useNotificationContext"

export default function GameAlert(){
    const { notificationState } = useNotificationContext();

    if (
        !notificationState.hasAGameQueuing &&
        !notificationState.hasAGameOnGoing &&
        !notificationState.hasAGameDisconnected
    ){
        return <></>;
    }

    function gameNotif(){
        if (notificationState.hasAGameQueuing){
            return <>
                <Spinner size="sm" animation="border" variant="dark" /> 
                <span className="ps-2">
                    You have a game queuing... <a href="#" className="alert-link">an example link</a>. Give it a click if you like.
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
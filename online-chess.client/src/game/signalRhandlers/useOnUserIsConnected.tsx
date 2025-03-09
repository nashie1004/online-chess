import { useEffect } from "react";
import useSignalRContext from "../../hooks/useSignalRContext";
import { eventEmitter } from "../utilities/eventEmitter";
import { EVENT_ON } from "../../constants/emitters";
import useNotificationContext from "../../hooks/useNotificationContext";

export default function useOnUserIsConnected(){
    const { userConnectionId } = useSignalRContext();
    const { notificationState } = useNotificationContext();

    useEffect(() => {
        eventEmitter.emit(EVENT_ON.SET_USER_IS_CONNECTED, userConnectionId !== null);

        return () => {
            eventEmitter.off(EVENT_ON.SET_USER_IS_CONNECTED);
        };
    }, [userConnectionId]);

    // TODO 3/8/2025 also add other use effects here
    // like closing of modal spinner if 404 room not found
    useEffect(() => {
        if (!notificationState.hasAGameOnGoing) return;

    }, [notificationState.hasAGameOnGoing]);

    return {};
}
import { useEffect } from "react";
import useSignalRContext from "../../hooks/useSignalRContext";
import { eventEmitter } from "../utilities/eventEmitter";
import { EVENT_EMIT } from "../../constants/emitters";

export default function useOnUserIsConnected(){
    const { userConnectionId } = useSignalRContext();

    useEffect(() => {
        eventEmitter.emit(EVENT_EMIT.SET_USER_IS_CONNECTED, userConnectionId !== null);

        return () => {
            eventEmitter.off(EVENT_EMIT.SET_USER_IS_CONNECTED);
        };
    }, [userConnectionId]);

    return {};
}
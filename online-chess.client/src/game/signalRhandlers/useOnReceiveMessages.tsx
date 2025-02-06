import { useCallback } from "react";
import useGameContext from "../../hooks/useGameContext";
import { IChat } from "../utilities/types";

export default function useOnReceiveMessages(){
    const { setGameState } = useGameContext();

    const onReceiveMessages = useCallback((messages: IChat[]) => {
        setGameState({ type: "SET_MESSAGES", payload: messages })
    }, []);

    return onReceiveMessages;
}
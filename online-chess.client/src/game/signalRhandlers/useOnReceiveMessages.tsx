import { useCallback } from "react";
import useGameContext from "../../hooks/useGameContext";
import { IOnReceiveMessages } from "./types";

export default function useOnReceiveMessages(){
    const { setGameState } = useGameContext();

    const onReceiveMessages = useCallback((messages: IOnReceiveMessages[]) => {
        setGameState({ type: "SET_MESSAGES", payload: messages })
    }, []);

    return onReceiveMessages;
}
import { useCallback } from "react";
import useGameContext from "../../hooks/useGameContext";
import { IMoveHistory } from "../utilities/types";

export default function useOnReceiveMoveHistory(){
    const { setGameState } = useGameContext();

    const onReceiveMoveHistory = useCallback((moveHistory: IMoveHistory) => {
        setGameState({ type: "SET_MOVEHISTORY", payload: moveHistory });
    }, []);

    return onReceiveMoveHistory;
}
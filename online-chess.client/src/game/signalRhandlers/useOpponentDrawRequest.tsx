import { useCallback } from "react";
import useGameContext from "../../hooks/useGameContext";

export default function useOpponentDrawRequest(){
    const { setGameState } = useGameContext();

    const onOpponentDrawRequest = useCallback(() => {
        setGameState({ type: "SET_OPPONENTINFO_REQUESTDRAW", payload: true });
    }, []);

    return onOpponentDrawRequest;
}
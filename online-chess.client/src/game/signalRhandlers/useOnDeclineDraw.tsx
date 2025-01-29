import { useCallback } from "react";
import useGameContext from "../../hooks/useGameContext";

export default function useOnDeclineDraw(){
    const { setGameState } = useGameContext();

    const onDeclineDraw = useCallback(() => {
        setGameState({ type: "SET_GAMESTATUS", payload: "ONGOING" });
        setGameState({ type: "SET_OPPONENTINFO_REQUESTDRAW", payload: false });

    }, []);

    return onDeclineDraw;
}
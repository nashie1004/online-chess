import { useCallback } from "react";
import useGameContext from "../../hooks/useGameContext";
import { IPiece } from "../utilities/types";

export default function useOnReceiveCaptureHistory(){
    const { setGameState } = useGameContext();

    const onReceiveCaptureHistory = useCallback((captureHistory: IPiece[]) => {
        setGameState({ type: "SET_CAPTUREHISTORY", payload: captureHistory });
    }, []);

    return onReceiveCaptureHistory;
}
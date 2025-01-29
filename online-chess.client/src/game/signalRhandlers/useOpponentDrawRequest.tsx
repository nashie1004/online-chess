import { useCallback } from "react";
import useGameContext from "../../hooks/useGameContext";

export default function useOpponentDrawRequest(){
    const { gameState, setGameState } = useGameContext();

    const onOpponentDrawRequest = () => {

        console.log("onOpponentDrawRequest: ", gameState.opponentInfo)

        setGameState({
            type: "SET_OPPONENTINFO",
            payload: {
                ...gameState.opponentInfo,
                isOfferingADraw: true
            }
        });

    };

    return onOpponentDrawRequest;
}
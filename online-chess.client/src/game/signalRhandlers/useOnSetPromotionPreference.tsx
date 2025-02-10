import { useCallback } from "react";
import useGameContext from "../../hooks/useGameContext";
import { PromotionPrefence } from "../utilities/types";

export default function useOnSetPromotionPreference(){
    const { setGameState, gameState } = useGameContext();

    const onSetPromotionPreference = useCallback((data: any) => {
        const player1Name = data.player1Name as string;
        const player1Preference = data.player1Preference as PromotionPrefence;
        const player2Name = data.player2Name as string;
        const player2Preference = data.player2Preference as PromotionPrefence;
        return //TODO
        if (player1Name === gameState.myInfo.userName){
            setGameState({ type: "SET_MYINFO_PROMOTEPAWNTO", payload: "queen" });
            setGameState({ type: "SET_OPPONENTINFO_PROMOTEPAWNTO", payload: "queen" });
        } else {
            setGameState({ type: "SET_MYINFO_PROMOTEPAWNTO", payload: "queen" });
            setGameState({ type: "SET_OPPONENTINFO_PROMOTEPAWNTO", payload: "queen" });
        }
    }, []);

    return onSetPromotionPreference;
}
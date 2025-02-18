import { useCallback, useRef } from "react";
import useGameContext from "../../hooks/useGameContext";
import { eventEmitter } from "../utilities/eventEmitter";
import { EVENT_EMIT } from "../../constants/emitters";
import { IOnSetPromotionPreference } from "./types";

export default function useOnSetPromotionPreference(){
    const { setGameState, gameState } = useGameContext();
    const gameStateRef = useRef(gameState);

    gameStateRef.current = gameState;

    const onSetPromotionPreference = useCallback((data: IOnSetPromotionPreference) => {

        const { playerName, preference } = data;

        if (playerName === gameStateRef.current.myInfo.userName)
        {
            setGameState({ type: "SET_MYINFO_PROMOTEPAWNTO", payload: preference });
            eventEmitter.emit(EVENT_EMIT.SET_PROMOTE_TO, {
                isWhite: gameStateRef.current.myInfo.playerIsWhite,
                preference
            });
        } 
        else {
            setGameState({ type: "SET_OPPONENTINFO_PROMOTEPAWNTO", payload: preference });
            eventEmitter.emit(EVENT_EMIT.SET_PROMOTE_TO, {
                isWhite: gameStateRef.current.opponentInfo.playerIsWhite,
                preference
            });
        }

    }, []);

    return onSetPromotionPreference;
}
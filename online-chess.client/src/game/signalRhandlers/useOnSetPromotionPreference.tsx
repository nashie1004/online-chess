import { useCallback, useRef } from "react";
import useGameContext from "../../hooks/useGameContext";
import { PlayersPromotePreference, PromotionPrefence } from "../utilities/types";
import { eventEmitter } from "../utilities/eventEmitter";
import { eventEmit } from "../utilities/constants";

export default function useOnSetPromotionPreference(){
    const { setGameState, gameState } = useGameContext();
    const gameStateRef = useRef(gameState);

    gameStateRef.current = gameState;

    const onSetPromotionPreference = useCallback((data: any) => {
        const playerName = data.playerName as string;
        const preference = data.preference as PromotionPrefence;

        if (playerName === gameStateRef.current.myInfo.userName)
        {
            setGameState({ type: "SET_MYINFO_PROMOTEPAWNTO", payload: preference });
            eventEmitter.emit(eventEmit.setPromoteTo, {
                isWhite: gameStateRef.current.myInfo.playerIsWhite,
                preference
            });
        } 
        else {
            setGameState({ type: "SET_OPPONENTINFO_PROMOTEPAWNTO", payload: preference });
            eventEmitter.emit(eventEmit.setPromoteTo, {
                isWhite: gameStateRef.current.opponentInfo.playerIsWhite,
                preference
            });
        }

        //console.log("prefernce",data)
    }, []);

    return onSetPromotionPreference;
}
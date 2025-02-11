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

        if (playerName === gameState.myInfo.userName){
            setGameState({ type: "SET_MYINFO_PROMOTEPAWNTO", payload: preference });
        } else {
            setGameState({ type: "SET_OPPONENTINFO_PROMOTEPAWNTO", payload: preference });
        }

        const retVal: PlayersPromotePreference = {
            white: gameStateRef.current.myInfo.playerIsWhite ? gameStateRef.current.myInfo.promotePawnTo : gameStateRef.current.opponentInfo.promotePawnTo,
            black: !gameStateRef.current.myInfo.playerIsWhite ? gameStateRef.current.myInfo.promotePawnTo : gameStateRef.current.opponentInfo.promotePawnTo,
        };

        //console.log("prefernce",retVal, data)
        eventEmitter.emit(eventEmit.setPromoteTo, retVal);
    }, []);

    return onSetPromotionPreference;
}
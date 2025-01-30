import { useCallback, useRef } from "react";
import useGameContext from "../../hooks/useGameContext";
import { eventEmitter } from "../utilities/eventEmitter";
import { IMoveInfo } from "../utilities/types";
/**
 * This updates:
 * - move history
 * - TODO capture history
 * - TODO timer
 */
export default function useOnUpdateBoard(){
    const { setGameState, gameState } = useGameContext();
    const gameStateRef = useRef(gameState);
    gameStateRef.current = gameState;

    const onUpdateBoard = useCallback((data: any) => {
        const moveInfo = data.moveInfo as IMoveInfo;
        const moveIsWhite = data.moveIsWhite as boolean;
        const whiteTimeLeft = data.creatorTimeLeft as number;
        const blackTimeLeft = data.blackTimeLeft as number;
        const creatorColorIsWhite = data.creatorColorIsWhite as boolean;

        const myCurrentTime = (gameStateRef.current.myInfo.playerIsWhite && creatorColorIsWhite)
            ? whiteTimeLeft : blackTimeLeft;

        const opponentCurrentTime = (gameStateRef.current.opponentInfo.playerIsWhite && creatorColorIsWhite)
            ? whiteTimeLeft : blackTimeLeft;

        setGameState({ type: "SET_MOVEHISTORY", payload: { moveInfo, moveIsWhite } });
        setGameState({ type: "SET_MYINFO_TIMELEFT", payload: myCurrentTime });
        setGameState({ type: "SET_OPPONENTINFO_TIMELEFT", payload: opponentCurrentTime });

        eventEmitter.emit("setMoveHistory", gameState.moveHistory);

    }, [])
    
    return onUpdateBoard; 
}
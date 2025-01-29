import { useCallback } from "react";
import useGameContext from "../../hooks/useGameContext";
import { eventEmitter } from "../utilities/eventEmitter";
/**
 * This updates:
 * - move history
 * - TODO capture history
 * - TODO timer
 */
export default function useOnUpdateBoard(){
    const { setGameState, gameState } = useGameContext();
    
    const onUpdateBoard = useCallback((data: any) => {
        
        setGameState({ type: "SET_MOVEHISTORY", payload: data });

        eventEmitter.emit("setMoveHistory", gameState.moveHistory);

    }, [])
    
    return onUpdateBoard; 
}
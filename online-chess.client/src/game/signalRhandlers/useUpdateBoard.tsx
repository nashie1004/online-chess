import { useCallback } from "react";
import useGameContext from "../../hooks/useGameContext";
/**
 * This updates:
 * - move history
 * - TODO capture history
 * - TODO timer
 */
export default function useUpdateBoard(){
    const { setGameState } = useGameContext();
    
    const updateBoard = useCallback((data: any) => {
        
        // console.log(data)

        setGameState({
            type: "SET_MOVEHISTORY",
            payload: data
        });

    }, [])
    
    return updateBoard; 
}
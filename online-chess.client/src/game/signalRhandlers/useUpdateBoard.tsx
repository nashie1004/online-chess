import { useCallback } from "react";
import usePhaserContext from "../../hooks/usePhaserContext";
import { IPieceMove } from "../utilities/types";
/**
 * This updates:
 * - move history
 * - TODO capture history
 * - TODO timer
 */
export default function useUpdateBoard(){
    const { setMoveHistory } = usePhaserContext();
    
    const updateBoard = useCallback((data: any) => {
        const moveInfo = data.moveInfo as IPieceMove;
        const moveIsWhite = data.moveIsWhite as boolean;

        setMoveHistory(prev => {
            if (moveIsWhite){
                return ({ ...prev, white: [...prev.white, moveInfo] })
            }
            return ({ ...prev, black: [...prev.black, moveInfo] })
        });
    }, [])
    
    return updateBoard; 
}
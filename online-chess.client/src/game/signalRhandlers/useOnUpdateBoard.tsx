import { useCallback, useRef } from "react";
import useGameContext from "../../hooks/useGameContext";
import { eventEmitter } from "../utilities/eventEmitter";
import { IMoveInfo, IPiece, IPieceMove } from "../utilities/types";
import { EVENT_EMIT } from "../../constants/emitters";

export default function useOnUpdateBoard(){
    const { setGameState, gameState } = useGameContext();
    const gameStateRef = useRef(gameState);

    gameStateRef.current = gameState;

    const onUpdateBoard = useCallback((data: any) => {
        const moveInfo = data.moveInfo as IMoveInfo;

        const moveIsWhite = data.moveIsWhite as boolean;
      
        const capturedPiece = data.capturedPiece as (IPiece | null);

        const opponentsTurn = (!moveIsWhite && !gameStateRef.current.opponentInfo.playerIsWhite) ||
            (moveIsWhite && gameStateRef.current.opponentInfo.playerIsWhite);

        if (opponentsTurn)
        {
            eventEmitter.emit(EVENT_EMIT.SET_ENEMY_MOVE, data.moveInfo as IPieceMove);
        } 
        
        setGameState({ type: "SET_OPPONENTINFO_ISPLAYERSTURN", payload: opponentsTurn });
        
        setGameState({ type: "SET_MYINFO_ISPLAYERSTURN", payload: !opponentsTurn });

        setGameState({ type: "SET_MOVEHISTORY", payload: { moveInfo, moveIsWhite } });

        if (capturedPiece){
            setGameState({ type: "SET_CAPTUREHISTORY", payload: capturedPiece });
        }

        eventEmitter.emit(EVENT_EMIT.SET_MOVE_HISTORY, gameState.moveHistory);
    }, [])
    
    return onUpdateBoard; 
}
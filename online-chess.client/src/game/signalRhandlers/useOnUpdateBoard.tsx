import { useCallback, useRef } from "react";
import useGameContext from "../../hooks/useGameContext";
import { eventEmitter } from "../utilities/eventEmitter";
import { IMoveInfo, IPiece, IPieceMove } from "../utilities/types";
import { eventEmit } from "../utilities/constants";
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
        const creatorTimeLeft = data.creatorTimeLeft as number;
        const joinerTimeLeft = data.joinerTimeLeft as number;
        const creatorColorIsWhite = data.creatorColorIsWhite as boolean;
        const capturedPiece = data.capturedPiece as (IPiece | null);

        const myCurrentTime = (gameStateRef.current.myInfo.playerIsWhite && creatorColorIsWhite)
            ? creatorTimeLeft : joinerTimeLeft;

        const opponentCurrentTime = (gameStateRef.current.opponentInfo.playerIsWhite && creatorColorIsWhite)
            ? creatorTimeLeft : joinerTimeLeft;

        // opponent piece move
        if (
            (!moveIsWhite && !gameStateRef.current.opponentInfo.playerIsWhite) ||
            (moveIsWhite && gameStateRef.current.opponentInfo.playerIsWhite)
        )
        {
            eventEmitter.emit(eventEmit.setEnemyMove, data.moveInfo as IPieceMove);
        } 

        setGameState({ type: "SET_MOVEHISTORY", payload: { moveInfo, moveIsWhite } });
        setGameState({ type: "SET_MYINFO_TIMELEFT", payload: myCurrentTime });
        setGameState({ type: "SET_OPPONENTINFO_TIMELEFT", payload: opponentCurrentTime });

        if (capturedPiece){
            setGameState({ type: "SET_CAPTUREHISTORY", payload: capturedPiece });
        }

        eventEmitter.emit(eventEmit.setMoveHistory, gameState.moveHistory);
    }, [])
    
    return onUpdateBoard; 
}
import { useRef } from "react";
import useGameContext from "../../hooks/useGameContext";
import { eventEmitter } from "../utilities/eventEmitter";
import { EVENT_EMIT } from "../../constants/emitters";
import { IOnUpdateBoard } from "./types";
import { IMoveHistoryAppend } from "../../context/types";

export default function useOnUpdateBoard(){
    const { setGameState, gameState } = useGameContext();
    const gameStateRef = useRef(gameState);

    gameStateRef.current = gameState;

    const onUpdateBoard = (data: IOnUpdateBoard) => {

        const { moveInfo, moveIsWhite, capturedPiece } = data;

        const opponentsTurn = (!moveIsWhite && !gameStateRef.current.opponentInfo.playerIsWhite) ||
            (moveIsWhite && gameStateRef.current.opponentInfo.playerIsWhite);

        if (opponentsTurn)
        {
            eventEmitter.emit(EVENT_EMIT.SET_ENEMY_MOVE, moveInfo);
        } 

        setGameState({ type: "SET_OPPONENTINFO_ISPLAYERSTURN", payload: opponentsTurn });
        
        setGameState({ type: "SET_MYINFO_ISPLAYERSTURN", payload: !opponentsTurn });
        
        if (capturedPiece){
            setGameState({ type: "SET_CAPTUREHISTORY_APPEND", payload: capturedPiece });
        }

        const newMoveHistoryRecord: IMoveHistoryAppend = { moveInfo: data.moveHistoryLatestMove, moveIsWhite };

        setGameState({ type: "SET_MOVEHISTORY_APPEND", payload: newMoveHistoryRecord });

        eventEmitter.emit(EVENT_EMIT.SET_MOVE_HISTORY_APPEND, newMoveHistoryRecord);
    }
    
    return onUpdateBoard; 
}
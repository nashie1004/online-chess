import { useCallback, useRef } from "react";
import useGameContext from "../../hooks/useGameContext";
import { eventEmitter } from "../utilities/eventEmitter";
import { IPieceMove } from "../utilities/types";
import { EVENT_EMIT } from "../../constants/emitters";
import { IOnUpdateBoard } from "./types";

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

        console.log("opponents turn: ", opponentsTurn)
        
        setGameState({ type: "SET_OPPONENTINFO_ISPLAYERSTURN", payload: opponentsTurn });
        
        setGameState({ type: "SET_MYINFO_ISPLAYERSTURN", payload: !opponentsTurn });

        setGameState({ type: "SET_MOVEHISTORY", payload: { moveInfo, moveIsWhite } });

        // TODO 2/26/2025 - Replcae this with signalr capture history
        //if (capturedPiece){
            //setGameState({ type: "SET_CAPTUREHISTORY", payload: capturedPiece });
        //}

        eventEmitter.emit(EVENT_EMIT.SET_MOVE_HISTORY, gameState.moveHistory);
    }
    
    return onUpdateBoard; 
}
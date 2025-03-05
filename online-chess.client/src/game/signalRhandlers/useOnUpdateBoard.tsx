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

        const newMoveHistoryRecord: IMoveHistoryAppend = { moveInfo: data.moveHistoryLatestMove, moveIsWhite };

        setGameState({ type: "SET_MOVEHISTORY_APPEND", payload: newMoveHistoryRecord });

        eventEmitter.emit(EVENT_EMIT.SET_MOVE_HISTORY_APPEND, newMoveHistoryRecord);

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

        if (!gameStateRef.current.myInfo.playerIsWhite){
            data.bothKingsState.white.x = Math.abs(7 - data.bothKingsState.white.x);
            data.bothKingsState.white.y = Math.abs(7 - data.bothKingsState.white.y);
            data.bothKingsState.white.checkedBy = data.bothKingsState.white.checkedBy.map(i => ({ x: Math.abs(i.x - 7), y: Math.abs(i.y - 7) }));

            data.bothKingsState.black.x = Math.abs(7 - data.bothKingsState.black.x);
            data.bothKingsState.black.y = Math.abs(7 - data.bothKingsState.black.y);
            data.bothKingsState.black.checkedBy = data.bothKingsState.black.checkedBy.map(i => ({ x: Math.abs(i.x - 7), y: Math.abs(i.y - 7) }));
        }

        eventEmitter.emit(EVENT_EMIT.SET_BOTH_KINGS_STATE, data.bothKingsState);
        
        const playerIsWhite = gameStateRef.current.myInfo.playerIsWhite;

        setGameState({ type: "SET_MYINFO_KINGSTATE" , payload: data.bothKingsState[playerIsWhite ? "white" : "black"] });
        setGameState({ type: "SET_OPPONENTINFO_KINGSTATE" , payload: data.bothKingsState[!playerIsWhite ? "white" : "black"] });
    }
    
    return onUpdateBoard; 
}
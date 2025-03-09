import { useRef } from "react";
import useGameContext from "../../hooks/useGameContext";
import { eventEmitter } from "../utilities/eventEmitter";
import { EVENT_ON } from "../../constants/emitters";
import { IOnUpdateBoard } from "./types";
import { IMoveHistoryAppend } from "../../context/types";

export default function useOnUpdateBoard(){
    const { setGameState, gameState } = useGameContext();
    const gameStateRef = useRef(gameState);

    gameStateRef.current = gameState;

    const onUpdateBoard = (data: IOnUpdateBoard) => {

        const { moveInfo, moveIsWhite, capturedPiece, bothKingsState, moveHistoryLatestMove } = data;

        const newMoveHistoryRecord: IMoveHistoryAppend = { moveInfo: moveHistoryLatestMove, moveIsWhite };

        setGameState({ type: "SET_MOVEHISTORY_APPEND", payload: newMoveHistoryRecord });

        eventEmitter.emit(EVENT_ON.SET_MOVE_HISTORY_APPEND, newMoveHistoryRecord);

        const opponentsTurn = (!moveIsWhite && !gameStateRef.current.opponentInfo.playerIsWhite) ||
            (moveIsWhite && gameStateRef.current.opponentInfo.playerIsWhite);

        if (opponentsTurn)
        {
            eventEmitter.emit(EVENT_ON.SET_ENEMY_MOVE, moveInfo);
        } 

        setGameState({ type: "SET_OPPONENTINFO_ISPLAYERSTURN", payload: opponentsTurn });
        
        setGameState({ type: "SET_MYINFO_ISPLAYERSTURN", payload: !opponentsTurn });
        
        if (capturedPiece){
            setGameState({ type: "SET_CAPTUREHISTORY_APPEND", payload: capturedPiece });
        }

        if (!gameStateRef.current.myInfo.playerIsWhite){
            bothKingsState.white.x = Math.abs(7 - bothKingsState.white.x);
            bothKingsState.white.y = Math.abs(7 - bothKingsState.white.y);
            bothKingsState.white.checkedBy = bothKingsState.white.checkedBy.map(i => ({ x: Math.abs(i.x - 7), y: Math.abs(i.y - 7) }));

            bothKingsState.black.x = Math.abs(7 - bothKingsState.black.x);
            bothKingsState.black.y = Math.abs(7 - bothKingsState.black.y);
            bothKingsState.black.checkedBy = bothKingsState.black.checkedBy.map(i => ({ x: Math.abs(i.x - 7), y: Math.abs(i.y - 7) }));
        }

        eventEmitter.emit(EVENT_ON.SET_BOTH_KINGS_STATE, bothKingsState);
        
        const playerIsWhite = gameStateRef.current.myInfo.playerIsWhite;

        setGameState({ type: "SET_MYINFO_KINGSTATE" , payload: bothKingsState[playerIsWhite ? "white" : "black"] });
        setGameState({ type: "SET_OPPONENTINFO_KINGSTATE" , payload: bothKingsState[!playerIsWhite ? "white" : "black"] });
    }
    
    return onUpdateBoard; 
}
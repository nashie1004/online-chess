import { useCallback } from "react";
import { GameStatus } from "../utilities/constants";
import useGameContext from "../../hooks/useGameContext";

export default function useOnGameOver(){
    const { setGameState, gameState } = useGameContext();

    const onGameOver = useCallback((outcome: GameStatus) => {
        setGameState({ type: "SET_GAMESTATUS", payload: "FINISHED" });
        
        switch(outcome){
            case GameStatus.Won:
                setGameState({ 
                    type: "SET_OPPONENTINFO",
                    payload: { ...gameState.myInfo, resign: true }
                });

                break;
            case GameStatus.Lose:
                setGameState({ 
                    type: "SET_MYINFO",
                    payload: { ...gameState.myInfo, resign: true }
                });

                break;
            default:
                setGameState({ 
                    type: "SET_MYINFO", payload: { 
                        ...gameState.myInfo, 
                        kingsState: {
                            ...gameState.myInfo.kingsState,
                            isInStalemate: true
                        } 
                    }
                });
                setGameState({ 
                    type: "SET_OPPONENTINFO", payload: { 
                        ...gameState.myInfo, 
                        kingsState: {
                            ...gameState.myInfo.kingsState,
                            isInStalemate: true
                        } 
                    }
                });

                break;
        }

    }, []);

    return onGameOver;
}
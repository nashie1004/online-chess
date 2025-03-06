import { useCallback } from "react";
import { EndGameStatus } from "../utilities/constants";
import useGameContext from "../../hooks/useGameContext";
import useNotificationContext from "../../hooks/useNotificationContext";

export default function useOnGameOver(){
    const { setGameState, gameState } = useGameContext();
    const { setNotificationState } = useNotificationContext();

    const onGameOver = useCallback((outcome: EndGameStatus) => {
        setNotificationState({ type: "SET_RESETNOTIFICATIONS" });
        setGameState({ type: "SET_CLEARGAMESTATE" });
        setGameState({ type: "SET_GAMESTATUS", payload: "FINISHED" });
        
        // TODO 3/6/2025 1PM
        /*
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
        */

    }, []);

    return onGameOver;
}
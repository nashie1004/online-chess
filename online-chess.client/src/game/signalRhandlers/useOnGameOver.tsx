import { useCallback } from "react";
import { EndGameStatus } from "../utilities/constants";
import useGameContext from "../../hooks/useGameContext";
import useNotificationContext from "../../hooks/useNotificationContext";
import useGameUIHandlerContext from "../../hooks/useGameUIHandlerContext";

export default function useOnGameOver(){
    const { setGameState, gameState } = useGameContext();
    const { setNotificationState } = useNotificationContext();
    const { setGameOverMessage, setShowLoadingModal } = useGameUIHandlerContext();

    const onGameOver = (data: any) => {
        // TODO 3/8/2025
        const finalMessage: string = data.finalMessage; 
        const finalGameStatus: EndGameStatus = data.finalGameStatus;
        const creatorIdentityName: string = data.creatorIdentityName;
        const userIsCreator = gameState.myInfo.userName === creatorIdentityName;
        const userWon = (
            // user won
            (
            (
                finalGameStatus === EndGameStatus.CreatorIsCheckmated ||
                finalGameStatus === EndGameStatus.CreatorResigned ||
                finalGameStatus === EndGameStatus.CreatorTimeIsUp
            ) && !userIsCreator
            ) 
            ||
            // user lost
            (
            (
                finalGameStatus === EndGameStatus.JoinerIsCheckmated ||
                finalGameStatus === EndGameStatus.JoinerResigned ||
                finalGameStatus === EndGameStatus.JoinerTimeIsUp
            ) && userIsCreator
            )
        );

        setNotificationState({ type: "SET_RESETNOTIFICATIONS" });
        setShowLoadingModal(false);
        setGameOverMessage(finalMessage);
        // setGameState({ type: "SET_CLEARGAMESTATE" });
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

    };

    return onGameOver;
}
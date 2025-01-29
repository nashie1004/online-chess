import moment from "moment";
import { useCallback } from "react";
import { MainGameScene } from "../scenes/MainGameScene";
import { eventEmitter } from "../utilities/eventEmitter";
import { IInitialGameInfo, IKingState } from "../utilities/types";
import { Options as gameOptions } from "../utilities/constants";
import useGameContext from "../../hooks/useGameContext";
import useSignalRContext from "../../hooks/useSignalRContext";
import useAuthContext from "../../hooks/useAuthContext";

export default function useOnInitializeGameInfo(
    gameRef: React.MutableRefObject<Phaser.Game | null | undefined>
){
    const { setGameState, gameState } = useGameContext();
    const signalRContext = useSignalRContext();
    const { user } = useAuthContext();

    const onInitializeGameInfo = useCallback((initGameInfo: IInitialGameInfo) => {
        const playerIsWhite = (initGameInfo.createdByUserInfo.userName === user?.userName)
            ? initGameInfo.createdByUserInfo.isColorWhite
            : initGameInfo.joinedByUserInfo.isColorWhite;

        // init phaser
        if (!gameRef.current){
            gameRef.current = new Phaser.Game({
                type: Phaser.AUTO,
                width: gameOptions.width,
                height: gameOptions.height,
                parent: 'game-container',
                backgroundColor: '#028af8',
                scale: {
                    // mode: Phaser.Scale.RESIZE
                },
                scene: [
                    new MainGameScene("mainChessboard", playerIsWhite)
                ],
            });
        }

        const myInfo = (initGameInfo.createdByUserInfo.userName === user?.userName) 
            ? initGameInfo.createdByUserInfo 
            : initGameInfo.joinedByUserInfo;

        const opponentInfo = (initGameInfo.createdByUserInfo.userName === user?.userName) 
            ? initGameInfo.joinedByUserInfo 
            : initGameInfo.createdByUserInfo;

        setGameState({
            type: "SET_MYINFO",
            payload: {
                userName: myInfo.userName,
                kingsState: {
                    isInCheck: false, checkedBy: [],
                    isInStalemate: false, isCheckMate: false,
                },
                isPlayersTurn: myInfo.isPlayersTurnToMove,
                timeLeft: moment.duration(myInfo.timeLeft).asMilliseconds(),
                playerIsWhite: myInfo.isColorWhite,
                isOfferingADraw: false,
                resign: false
            }
        });
        
        setGameState({
            type: "SET_OPPONENTINFO",
            payload: {
                userName: opponentInfo.userName,
                kingsState: {
                    isInCheck: false, checkedBy: [],
                    isInStalemate: false, isCheckMate: false,
                },
                isPlayersTurn: opponentInfo.isPlayersTurnToMove,
                timeLeft: moment.duration(opponentInfo.timeLeft).asMilliseconds(),
                playerIsWhite: opponentInfo.isColorWhite,
                isOfferingADraw: false,
                resign: false
            }
        });

        setGameState({ type: "SET_GAMEROOMKEY", payload: initGameInfo.gameRoomKey });

        setGameState({ type: "SET_GAMETYPE", payload: initGameInfo.gameType });

        // connect react and phaser
        eventEmitter.on("setKingsState", (data: IKingState) => {
            
            if (data.white.isInCheck || data.white.isCheckMate || data.white.isInStalemate)
            {
                setGameState({ 
                    type: gameState.myInfo.playerIsWhite ? "SET_MYINFO" : "SET_OPPONENTINFO",
                    payload: {
                        ...gameState[gameState.myInfo.playerIsWhite ? "myInfo" : "opponentInfo"],
                        kingsState: data.white
                    }
                });
            } 
            else if (data.black.isInCheck || data.black.isCheckMate || data.black.isInStalemate) 
            {
                setGameState({ 
                    type: !gameState.myInfo.playerIsWhite ? "SET_MYINFO" : "SET_OPPONENTINFO",
                    payload: {
                        ...gameState[!gameState.myInfo.playerIsWhite ? "myInfo" : "opponentInfo"],
                        kingsState: data.black
                    }
                });
            }

        });
        
        eventEmitter.on("setMovePiece", (move: any) => {
            signalRContext.invoke("MovePiece", initGameInfo.gameRoomKey, move.oldMove, move.newMove);
        });

        setGameState({ type: "SET_GAMESTATUS", payload: "ONGOING" });
    }, []);

    return onInitializeGameInfo;
}
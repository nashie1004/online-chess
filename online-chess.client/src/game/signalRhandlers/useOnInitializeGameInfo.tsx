import moment from "moment";
import { useCallback, useRef } from "react";
import { MainGameScene } from "../scenes/MainGameScene";
import { eventEmitter } from "../utilities/eventEmitter";
import { IBothKingsPosition, IInitialGameInfo, IKingState, IMoveHistory, PlayersPromotePreference, PromotionPrefence } from "../utilities/types";
import pieces, { eventOn, Options as gameOptions, playPageInvokers } from "../utilities/constants";
import useGameContext from "../../hooks/useGameContext";
import useSignalRContext from "../../hooks/useSignalRContext";
import useAuthContext from "../../hooks/useAuthContext";
import useLocalStorage from "../../hooks/useLocalStorage";

export default function useOnInitializeGameInfo(
    gameRef: React.MutableRefObject<Phaser.Game | null | undefined>
){
    const { setGameState, gameState } = useGameContext();
    const signalRContext = useSignalRContext();
    const { user } = useAuthContext();
    const gameStateRef = useRef(gameState);
    const { data: boardUI } = useLocalStorage("board", "green.png");
    const { data: pieceUI } = useLocalStorage("piece", "cburnett");

    // https://stackoverflow.com/questions/57847594/accessing-up-to-date-state-from-within-a-callback
    // this contains the up to date version of our gamestate, 
    // since the old value is captured inside the callback fns
    gameStateRef.current = gameState; 

    const onInitializeGameInfo = useCallback((initGameInfo: IInitialGameInfo) => {
        const playerIsWhite = (initGameInfo.createdByUserInfo.userName === user?.userName)
            ? initGameInfo.createdByUserInfo.isColorWhite
            : initGameInfo.joinedByUserInfo.isColorWhite;

        const moveHistory: IMoveHistory = { white: [], black: [] };
        const bothKingsPosition: IBothKingsPosition = {
            // if black orientation switch queen and king coords
            white: { x: playerIsWhite ? 4 : 3, y: playerIsWhite ? 7 : 0 }
            , black: { x: playerIsWhite ? 4 : 3, y: playerIsWhite ? 0 : 7 }
        };
        const promotePreference: PlayersPromotePreference = {
            white: PromotionPrefence.Queen, black: PromotionPrefence.Queen
        };

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
                    new MainGameScene(
                        "mainChessboard", playerIsWhite, boardUI
                        , pieceUI, pieces, moveHistory
                        , bothKingsPosition, promotePreference
                    )
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
                resign: false,
                promotePawnTo: PromotionPrefence.Queen,
                openPromotionModal: false
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
                resign: false,
                promotePawnTo: PromotionPrefence.Queen,
                openPromotionModal: false
            }
        });

        setGameState({ type: "SET_GAMEROOMKEY", payload: initGameInfo.gameRoomKey });
        setGameState({ type: "SET_GAMETYPE", payload: initGameInfo.gameType });

        // connect react and phaser
        eventEmitter.on(eventOn.setKingsState, (data: IKingState) => {
            
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
        
        eventEmitter.on(eventOn.setMovePiece, (move: any) => {
            signalRContext.invoke(playPageInvokers.movePiece, initGameInfo.gameRoomKey, move.oldMove, move.newMove, move.hasCapture);
        });

        setGameState({ type: "SET_GAMESTATUS", payload: "ONGOING" });
    }, []);

    return onInitializeGameInfo;
}
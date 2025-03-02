import moment from "moment";
import { useCallback, useRef } from "react";
import { MainGameScene } from "../scenes/MainGameScene";
import { eventEmitter } from "../utilities/eventEmitter";
import { IBothKingsPosition, IKingState, IMoveHistory, IPiece, PlayersPromotePreference } from "../utilities/types";
import useGameContext from "../../hooks/useGameContext";
import useSignalRContext from "../../hooks/useSignalRContext";
import useAuthContext from "../../hooks/useAuthContext";
import useLocalStorage from "../../hooks/useLocalStorage";
import { EVENT_ON } from "../../constants/emitters";
import { PLAY_PAGE_INVOKERS } from "../../constants/invokers";
import { IMovePiece, IUseOnInitializeGameInfo } from "./types";
import { PromotionPrefence } from "../utilities/constants";

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

    const onInitializeGameInfo = useCallback((currentGameInfo: IUseOnInitializeGameInfo) => {
        const playerIsWhite = (currentGameInfo.createdByUserInfo.userName === user?.userName)
            ? currentGameInfo.createdByUserInfo.isColorWhite
            : currentGameInfo.joinedByUserInfo.isColorWhite;

        const myInfo = (currentGameInfo.createdByUserInfo.userName === user?.userName) 
            ? currentGameInfo.createdByUserInfo 
            : currentGameInfo.joinedByUserInfo;

        const opponentInfo = (currentGameInfo.createdByUserInfo.userName === user?.userName) 
            ? currentGameInfo.joinedByUserInfo 
            : currentGameInfo.createdByUserInfo;

        const moveHistory: IMoveHistory = { white: [], black: [] };

        const promotePreference: PlayersPromotePreference = {
            white: playerIsWhite ? myInfo.pawnPromotionPreference : opponentInfo.pawnPromotionPreference
            , black: !playerIsWhite ? myInfo.pawnPromotionPreference : opponentInfo.pawnPromotionPreference
        };

        const piecesCoordinatesInitial = currentGameInfo.piecesCoordinatesInitial;

        const isPlayersTurnToMove = myInfo.isPlayersTurnToMove;

        // just reorrient king coords if player is black
        if (!myInfo.isColorWhite)
        {
            
            if (!currentGameInfo.whiteKingHasMoved){
                currentGameInfo.bothKingsState.white.x = 3;   
                currentGameInfo.bothKingsState.white.y = 0;   
            }
            else {
                currentGameInfo.bothKingsState.white.x = Math.abs(currentGameInfo.bothKingsState.white.x - 7);   
                currentGameInfo.bothKingsState.white.y = Math.abs(currentGameInfo.bothKingsState.white.y - 7);   
            }

            if (!currentGameInfo.blackKingHasMoved){
                currentGameInfo.bothKingsState.black.x = 3;   
                currentGameInfo.bothKingsState.black.y = 7;
            }
            else {
                currentGameInfo.bothKingsState.black.x = Math.abs(currentGameInfo.bothKingsState.black.x - 7);   
                currentGameInfo.bothKingsState.black.y = Math.abs(currentGameInfo.bothKingsState.black.y - 7);   
            }

        }

        const bothKingsPosition: IBothKingsPosition = {
            white: { 
                x: currentGameInfo.bothKingsState.white.x
                , y: currentGameInfo.bothKingsState.white.y 
            }
            , black: { 
                x: currentGameInfo.bothKingsState.black.x
                , y: currentGameInfo.bothKingsState.black.y 
            }
        };

        /** To ensure that phaser and eventemitter listeners are only created once */
        if (!gameRef.current){
            gameRef.current = new Phaser.Game({
                type: Phaser.AUTO,
                width: 800,
                height: 800,
                parent: 'game-container',
                backgroundColor: '#028af8',
                scale: {
                    // mode: Phaser.Scale.RESIZE
                },
                scene: [
                    new MainGameScene(
                        "mainChessboard", myInfo.isColorWhite, boardUI
                        , pieceUI, piecesCoordinatesInitial, moveHistory
                        , bothKingsPosition, promotePreference, isPlayersTurnToMove
                    )
                ],
            });
            
            // connect react and phaser
            /*
            eventEmitter.on(EVENT_ON.SET_KINGS_STATE, (data: IKingState) => {
                console.log(data)

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
            */
            
            eventEmitter.on(EVENT_ON.SET_MOVE_PIECE, (move: IMovePiece) => {
                
                signalRContext.invoke(PLAY_PAGE_INVOKERS.MOVE_PIECE
                    , currentGameInfo.gameRoomKey, move.oldMove, move.newMove
                    , move.capture, move.castle
                );

            });

        }

        setGameState({
            type: "SET_MYINFO",
            payload: {
                userName: myInfo.userName,
                kingsState: (myInfo.isColorWhite ? currentGameInfo.bothKingsState.white : currentGameInfo.bothKingsState.black),
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
                kingsState: (opponentInfo.isColorWhite ? currentGameInfo.bothKingsState.white : currentGameInfo.bothKingsState.black),
                isPlayersTurn: opponentInfo.isPlayersTurnToMove,
                timeLeft: moment.duration(opponentInfo.timeLeft).asMilliseconds(),
                playerIsWhite: opponentInfo.isColorWhite,
                isOfferingADraw: false,
                resign: false,
                promotePawnTo: PromotionPrefence.Queen,
                openPromotionModal: false
            }
        });

        setGameState({ type: "SET_GAMEROOMKEY", payload: currentGameInfo.gameRoomKey });

        setGameState({ type: "SET_GAMETYPE", payload: currentGameInfo.gameType });

        setGameState({ type: "SET_GAMESTATUS", payload: "ONGOING" });
    }, []);

    return onInitializeGameInfo;
}
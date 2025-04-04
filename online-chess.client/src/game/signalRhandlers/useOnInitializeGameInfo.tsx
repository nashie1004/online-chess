import moment from "moment";
import { useCallback, useRef } from "react";
import { MainGameScene } from "../scenes/MainGameScene";
import { eventEmitter } from "../utilities/eventEmitter";
import { IBothKingsPosition, PlayersPromotePreference } from "../utilities/types";
import useGameContext from "../../hooks/useGameContext";
import useSignalRContext from "../../hooks/useSignalRContext";
import useAuthContext from "../../hooks/useAuthContext";
import { EVENT_ON } from "../../constants/emitters";
import { PLAY_PAGE_INVOKERS } from "../../constants/invokers";
import { IMovePiece, IUseOnInitializeGameInfo } from "./types";
import useGameUIHandlerContext from "../../hooks/useGameUIHandlerContext";
import useUserPreferenceContext from "../../hooks/useUserPreferenceContext";

export default function useOnInitializeGameInfo(
    gameRef: React.MutableRefObject<Phaser.Game | null | undefined>
){
    const { setGameState, gameState } = useGameContext();
    const { invoke, userConnectionId } = useSignalRContext();
    const { user } = useAuthContext();
    const gameStateRef = useRef(gameState);
    const { setShowLoadingModal } = useGameUIHandlerContext();
    const { boardUI, pieceUI, showCoords } = useUserPreferenceContext();

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

        const promotePreference: PlayersPromotePreference = {
            white: playerIsWhite ? myInfo.pawnPromotionPreference : opponentInfo.pawnPromotionPreference
            , black: !playerIsWhite ? myInfo.pawnPromotionPreference : opponentInfo.pawnPromotionPreference
        };

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

            currentGameInfo.bothKingsState.white.checkedBy = currentGameInfo.bothKingsState.white.checkedBy.map(i => ({ x: Math.abs(i.x - 7), y: Math.abs(i.y - 7) }));
            currentGameInfo.bothKingsState.black.checkedBy = currentGameInfo.bothKingsState.black.checkedBy.map(i => ({ x: Math.abs(i.x - 7), y: Math.abs(i.y - 7) }));
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

        setGameState({
            type: "SET_MYINFO",
            payload: {
                userName: myInfo.userName,
                kingsState: (myInfo.isColorWhite ? currentGameInfo.bothKingsState.white : currentGameInfo.bothKingsState.black),
                isPlayersTurn: myInfo.isPlayersTurnToMove,
                timeLeft: moment.duration(myInfo.timeLeft).asMilliseconds(),
                playerIsWhite: myInfo.isColorWhite,
                isOfferingADraw: false,
                promotePawnTo: myInfo.pawnPromotionPreference,
                profileImageUrl: myInfo.profileImageUrl,
                color: myInfo.color
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
                promotePawnTo: opponentInfo.pawnPromotionPreference,
                profileImageUrl: opponentInfo.profileImageUrl,
                color: opponentInfo.color
            }
        });

        setGameState({ type: "SET_GAMEROOMKEY", payload: currentGameInfo.gameRoomKey });

        setGameState({ type: "SET_GAMETYPE", payload: currentGameInfo.gameType });

        setGameState({ type: "SET_MOVEHISTORY", payload: currentGameInfo.moveHistory });

        setGameState({ type: "SET_CAPTUREHISTORY", payload: currentGameInfo.captureHistory });

        setGameState({ type: "SET_GAMESTATUS", payload: "ONGOING" });
        
        /** To ensure that phaser and eventemitter listeners are only created once */
        if (gameRef.current) return;

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
                    , pieceUI, currentGameInfo.piecesCoordinatesInitial, currentGameInfo.moveHistory
                    , bothKingsPosition, promotePreference, myInfo.isPlayersTurnToMove
                    , currentGameInfo.bothKingsState, userConnectionId !== null, showCoords
                )
            ],
        });
        
        eventEmitter.on(EVENT_ON.SET_MOVE_PIECE, (move: IMovePiece) => {
            
            invoke(PLAY_PAGE_INVOKERS.MOVE_PIECE
                , currentGameInfo.gameRoomKey, move.oldMove, move.newMove
                , move.capture, move.castle, move.kingsState
                , move.promote
            );

        });

        eventEmitter.on(EVENT_ON.SET_PHASER_DONE_LOADING, (data: boolean) => {
            setShowLoadingModal(false);
        });

        // setTimeout(() => {
        //     setShowLoadingModal(false);
        // }, 1500)

    }, []);

    return onInitializeGameInfo;
}
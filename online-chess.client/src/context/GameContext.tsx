import { createContext, useReducer } from 'react'
import { baseGameState } from '../game/utilities/constants';
import { IBaseContextProps } from '../types/global';
import { IMove } from '../game/utilities/types';
import { IGameContext, IGameContextReducerActions, IGameContextReducerState } from './types';

export const gameContext = createContext<IGameContext | null>(null);

function reducerFn(state: IGameContextReducerState, action: IGameContextReducerActions){
    
    switch(action.type){
        case "SET_MESSAGES":
            return {  ...state, messages: action.payload }
        case "SET_GAMEROOMKEY":
            return {  ...state, gameRoomKey: action.payload }
        case "SET_MOVEHISTORY":
            const moveInfo: IMove = {
                old: {
                    x: action.payload.moveInfo.old.x,
                    y: action.payload.moveInfo.old.y,
                    pieceName: action.payload.moveInfo.old.uniqueName
                },
                new: {
                    x: action.payload.moveInfo.new.x,
                    y: action.payload.moveInfo.new.y,
                    pieceName: action.payload.moveInfo.new.uniqueName
                }
            };

            const moveIsWhite = action.payload.moveIsWhite as boolean;

            if (moveIsWhite){
                return {  
                    ...state, moveHistory: { 
                        black: state.moveHistory.black
                        , white: [ ...state.moveHistory.white, moveInfo ] 
                    }  
                };
            } 

            return {  
                ...state, moveHistory: { 
                    white: state.moveHistory.white
                    , black: [ ...state.moveHistory.black, moveInfo ] 
                }  
            };

        case "SET_CAPTUREHISTORY":
            return {  ...state, captureHistory: [...state.captureHistory, action.payload] }
        case "SET_MYINFO":
            return {  ...state, myInfo: action.payload }
        case "SET_MYINFO_TIMELEFT":
            return {  ...state, myInfo: {
                    ...state.myInfo, timeLeft: action.payload
                } 
            }
        case "SET_MYINFO_PROMOTEPAWNTO":
            return {  ...state, myInfo: {
                    ...state.myInfo, promotePawnTo: action.payload
                } 
            } 
        case "SET_MYINFO_OPENPROMOTIONMODAL":
            return {  ...state, myInfo: {
                    ...state.myInfo, openPromotionModal: action.payload
                } 
            } 
        case "SET_MYINFO_ISPLAYERSTURN":
            return {  ...state, myInfo: {
                    ...state.myInfo, isPlayersTurn: action.payload
                } 
            } 
        case "SET_OPPONENTINFO":
            return {  ...state, opponentInfo: action.payload }
        case "SET_OPPONENTINFO_TIMELEFT":
            return {  ...state, opponentInfo: {
                    ...state.opponentInfo, timeLeft: action.payload
                } 
            }
        case "SET_OPPONENTINFO_PROMOTEPAWNTO":
            return {  ...state, myInfo: {
                    ...state.myInfo, promotePawnTo: action.payload
                } 
            }
        case "SET_OPPONENTINFO_ISPLAYERSTURN":
            return {  ...state, myInfo: {
                    ...state.myInfo, isPlayersTurn: action.payload
                } 
            } 
        case "SET_OPPONENTINFO_REQUESTDRAW":
            return {  ...state, opponentInfo: {
                    ...state.opponentInfo, isOfferingADraw: action.payload
                } 
            }
        case "SET_GAMESTATUS":
            return {  ...state, gameStatus: action.payload }
        case "SET_GAMETYPE":
            return {  ...state, gameType: action.payload }
        case "SET_CLEARGAMESTATE":
            return baseGameState;
        default:
            return state;
    }
}

export default function GameContext(
    {children}: IBaseContextProps
) {
    const [gameState, setGameState] = useReducer<React.Reducer<IGameContextReducerState, IGameContextReducerActions>>(reducerFn, baseGameState);

  return (
    <gameContext.Provider value={{ gameState, setGameState }}>
        {children}
    </gameContext.Provider>
  )
}

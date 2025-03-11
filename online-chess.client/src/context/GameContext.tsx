import { createContext, useReducer } from 'react'
import { baseGameState } from '../game/utilities/constants';
import { IBaseContextProps } from '../types/global';
import { IGameContext, IGameContextReducerActions, IGameContextReducerState } from './types';

export const gameContext = createContext<IGameContext | null>(null);

function reducerFn(state: IGameContextReducerState, action: IGameContextReducerActions){
    
    switch(action.type){
        case "SET_MESSAGES":
            return { ...state, messages: action.payload }
        case "SET_MESSAGES_APPEND":
            return { ...state, messages: [ ...state.messages, action.payload ] };
        case "SET_GAMEROOMKEY":
            return {  ...state, gameRoomKey: action.payload }
        case "SET_MOVEHISTORY":
            return { ...state, moveHistory: action.payload };
        case "SET_MOVEHISTORY_APPEND":
            if (action.payload.moveIsWhite){
                return {  ...state, moveHistory: { 
                        black: state.moveHistory.black, white: [ ...state.moveHistory.white, action.payload.moveInfo ] 
                    }  
                };
            } 
            return {  ...state, moveHistory: { 
                    white: state.moveHistory.white , black: [ ...state.moveHistory.black, action.payload.moveInfo ] 
                }  
            };

        case "SET_CAPTUREHISTORY":
            return {  ...state, captureHistory: action.payload }
        case "SET_CAPTUREHISTORY_APPEND":
            return { ...state, captureHistory: [...state.captureHistory, action.payload] };
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
        case "SET_MYINFO_KINGSTATE":
            return {  ...state, myInfo: {
                    ...state.myInfo, kingsState: action.payload
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
            return {  ...state, opponentInfo: {
                    ...state.opponentInfo, promotePawnTo: action.payload
                } 
            }
        case "SET_OPPONENTINFO_ISPLAYERSTURN":
            return {  ...state, opponentInfo: {
                    ...state.opponentInfo, isPlayersTurn: action.payload
                } 
            } 
        case "SET_OPPONENTINFO_REQUESTDRAW":
            return {  ...state, opponentInfo: {
                    ...state.opponentInfo, isOfferingADraw: action.payload
                } 
            }
        case "SET_OPPONENTINFO_KINGSTATE":
            return {  ...state, opponentInfo: {
                    ...state.opponentInfo, kingsState: action.payload
                } 
            }
        case "SET_OPENOPTIONMODAL":
            return {  ...state, openOptionModal: action.payload }
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

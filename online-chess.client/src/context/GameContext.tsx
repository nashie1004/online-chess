import { createContext, ReactNode, useReducer } from 'react'
import { IGameContext, IGameContextReducerActions, IGameContextReducerState, IMove } from '../game/utilities/types';
import { baseGameState } from '../game/utilities/constants';

interface GameContextProps{
    children: ReactNode
}

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
            return {  ...state, gameHistory: action.payload }
        case "SET_MYINFO":
            return {  ...state, myInfo: action.payload }
        case "SET_OPPONENTINFO":
            return {  ...state, opponentInfo: action.payload }
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
    {children}: GameContextProps
) {
    const [gameState, setGameState] = useReducer<React.Reducer<IGameContextReducerState, IGameContextReducerActions>>(reducerFn, baseGameState);

  return (
    <gameContext.Provider value={{ gameState, setGameState }}>
        {children}
    </gameContext.Provider>
  )
}

import { createContext, ReactNode, useReducer } from 'react'
import { IGameContext, IGameContextReducerActions, IGameContextReducerState, IPieceMove } from '../game/utilities/types';

interface GameContextProps{
    children: ReactNode
}

export const gameContext = createContext<IGameContext | null>(null);

function reducerFn(state: IGameContextReducerState, action: IGameContextReducerActions){
    
    switch(action.type){
        case "SET_TIMER":
            return {  ...state, timer: action.payload }
        case "SET_MESSAGES":
            return {  ...state, messages: action.payload }
        case "SET_GAMEROOMKEY":
            return {  ...state, gameRoomKey: action.payload }
        case "SET_MOVEHISTORY":
            const moveInfo = action.payload.moveInfo as IPieceMove;
            const moveIsWhite = action.payload.moveIsWhite as boolean;

            if (moveIsWhite){
                return {  
                    ...state, moveHistory: { 
                        ...state.moveHistory.black
                        , white: [ ...state.moveHistory.white, moveInfo ] 
                    }  
                }
            } 
            return {  
                ...state, moveHistory: { 
                    ...state.moveHistory.white
                    , black: [ ...state.moveHistory.black, moveInfo ] 
                }  
            }

        case "SET_GAMEHISTORY":
            return {  ...state, gameHistory: action.payload }
        default:
            return state;
    }
}

export default function GameContext(
    {children}: GameContextProps
) {
    const [gameState, setGameState] = useReducer(reducerFn, {
        timer: { white: 0, black: 0, isWhitesTurn: true }
        ,messages: []
        ,gameRoomKey: null
        ,moveHistory: { white: [], black: [] }
        ,captureHistory: { white: [], black: [] }
    });

  return (
    <gameContext.Provider value={{ gameState, setGameState }}>
        {children}
    </gameContext.Provider>
  )
}

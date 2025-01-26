import { createContext, ReactNode, useReducer, useState } from 'react'
import { IGameContext, IChat, ITimer } from '../game/utilities/types';

interface GameContextProps{
    children: ReactNode
}

export const gameContext = createContext<IGameContext | null>(null);

function reducerFn(state, action){
    return state;
}

export default function GameContext(
    {children}: GameContextProps
) {
    const [timer, setTimer] = useState<ITimer>({ white: 0, black: 0, isWhitesTurn: true });
    const [messages, setMessages] = useState<IChat[]>([]);
    const [gameRoomKey, setGameRoomKey] = useState("");

    const [state, dispatch] = useReducer(reducerFn, {});

  return (
    <gameContext.Provider value={{
        timer, setTimer, messages, setMessages, gameRoomKey, setGameRoomKey
    }}>
        {children}
    </gameContext.Provider>
  )
}

import { createContext, ReactNode, useReducer, useState } from 'react'
import { IGameContext, IChat } from '../game/utilities/types';

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
    const [timer, setTimer] = useState({ white: 0, black: 0});
    const [messages, setMessages] = useState<IChat[]>([]);

    const [state, dispatch] = useReducer(reducerFn, {});

  return (
    <gameContext.Provider value={{
        timer, setTimer, messages, setMessages
    }}>
        {children}
    </gameContext.Provider>
  )
}

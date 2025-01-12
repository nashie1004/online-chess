import { createContext, ReactNode, useState } from 'react'
import { IMessage, IGameContext } from '../game/utilities/types';

interface GameContextProps{
    children: ReactNode
}

export const gameContext = createContext<IGameContext | null>(null);

export default function GameContext(
    {children}: GameContextProps
) {
    const [timer, setTimer] = useState({ white: 0, black: 0});
    const [messages, setMessages] = useState<IMessage[]>([]);

  return (
    <gameContext.Provider value={{
        timer, setTimer, messages, setMessages
    }}>
        {children}
    </gameContext.Provider>
  )
}

import { createContext, ReactNode, useState } from 'react'
import { IMessage, IReactContext } from '../game/utilities/types';

interface ReactContextProps{
    children: ReactNode
}

export const reactContext = createContext<IReactContext | null>(null);

export default function ReactContext(
    {children}: ReactContextProps
) {
    const [timer, setTimer] = useState({ white: 0, black: 0});
    const [messages, setMessages] = useState<IMessage[]>([]);

  return (
    <reactContext.Provider value={{
        timer, setTimer, messages, setMessages
    }}>
        {children}
    </reactContext.Provider>
  )
}

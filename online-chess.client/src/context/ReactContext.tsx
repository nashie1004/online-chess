import { createContext, ReactNode, useState } from 'react'
import { IReactContext, ITimer } from '../utils/types';

interface ReactContextProps{
    children: ReactNode
}

export const reactContext = createContext<IReactContext | null>(null);

export default function ReactContext(
    {children}: ReactContextProps
) {
    const [timer, setTimer] = useState({ white: 0, black: 0});

  return (
    <reactContext.Provider value={{
        timer, setTimer
    }}>
        {children}
    </reactContext.Provider>
  )
}

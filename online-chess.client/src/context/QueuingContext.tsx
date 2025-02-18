import { createContext, useState } from 'react'
import { IBaseContextProps } from '../types/global';
import { IQueuingContext } from './types';

export const queuingContext = createContext<null | IQueuingContext>(null);

export default function QueuingContext(
    {children} : IBaseContextProps
) {
    const [queuingRoomKey, setQueuingRoomKey] = useState<null | string>(null);

  return (
    <queuingContext.Provider value={{
        queuingRoomKey, setQueuingRoomKey
    }}>
        {children}
    </queuingContext.Provider>
  )
}

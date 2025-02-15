import React, { createContext, useState } from 'react'

interface IQueuingContext {
    queuingRoomKey: string | null;
    setQueuingRoomKey: React.Dispatch<React.SetStateAction<string | null>>;
}

interface IQueuingContextProps{
    children: React.ReactNode;
}

export const queuingContext = createContext<null | IQueuingContext>(null);

export default function QueuingContext(
    {children} : IQueuingContextProps
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

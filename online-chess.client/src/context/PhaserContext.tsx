import { createContext, ReactNode, useState } from 'react'
import { PromoteTo, IPhaserContext, IKingState } from '../game/utilities/types';

interface PhaserContextProps{
    children: ReactNode
}

export const phaserContext = createContext<IPhaserContext>({
    // local state
    isColorWhite: true, setIsColorWhite: () => {}
    , isWhitesOrientation: true, setIsWhitesOrientation: () => {}
})

export default function PhaserContext(
    {children} : PhaserContextProps
) {

    // local state
    const [isColorWhite, setIsColorWhite] = useState<boolean>(true);
    const [isWhitesOrientation, setIsWhitesOrientation] = useState<boolean>(true);

    const data: IPhaserContext = {
        isColorWhite, setIsColorWhite,
        isWhitesOrientation, setIsWhitesOrientation,
    }

  return (
    <phaserContext.Provider value={data}>
        {children}
    </phaserContext.Provider>
  )
}

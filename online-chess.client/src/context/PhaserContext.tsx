import { createContext, ReactNode, useState } from 'react'
import { PromoteTo, IPhaserContext, IKingState } from '../game/utilities/types';
import { baseKingState } from '../game/utilities/constants';

interface PhaserContextProps{
    children: ReactNode
}

export const phaserContext = createContext<IPhaserContext>({
    promoteTo: "queen", setPromoteTo: () => {}

    // local state
    , isColorWhite: true, setIsColorWhite: () => {}
    , isWhitesOrientation: true, setIsWhitesOrientation: () => {}
    , kingsState: baseKingState, setKingsState: () => {}
})

export default function PhaserContext(
    {children} : PhaserContextProps
) {
    const [kingsState, setKingsState] = useState<IKingState>(baseKingState);

    // local state
    const [isColorWhite, setIsColorWhite] = useState<boolean>(true);
    const [isWhitesOrientation, setIsWhitesOrientation] = useState<boolean>(true);
    const [promoteTo, setPromoteTo] = useState<PromoteTo>("queen");

    const data: IPhaserContext = {
        promoteTo, setPromoteTo,
        isColorWhite, setIsColorWhite,
        isWhitesOrientation, setIsWhitesOrientation,
        kingsState, setKingsState,
    }

  return (
    <phaserContext.Provider value={data}>
        {children}
    </phaserContext.Provider>
  )
}

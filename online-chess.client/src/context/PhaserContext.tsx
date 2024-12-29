import { createContext, ReactNode, useState } from 'react'
import { IMoveHistory, ICaptureHistory, PromoteTo, IPhaserContext, IKingState } from '../utils/types';
import { baseKingState } from '../utils/constants';


interface PhaserContextProps{
    children: ReactNode
}

export const phaserContext = createContext<IPhaserContext>({
    isWhitesTurn: true, setIsWhitesTurn: () => {}
    , moveHistory: { white: [], black: [] }, setMoveHistory: () => {}
    , captureHistory: { white: [], black: [] }, setCaptureHistory: () => {}
    , promoteTo: "queen", setPromoteTo: () => {}
    , isColorWhite: true, setIsColorWhite: () => {}
    , isWhitesOrientation: true, setIsWhitesOrientation: () => {}
    , kingsState: baseKingState, setKingsState: () => {}
})

export default function PhaserContext(
    {children} : PhaserContextProps
) {
    const [isWhitesTurn, setIsWhitesTurn] = useState(true);
    const [moveHistory, setMoveHistory] = useState<IMoveHistory>({ white: [], black: [] });
    const [captureHistory, setCaptureHistory] = useState<ICaptureHistory>({ white: [], black: [] });
    const [promoteTo, setPromoteTo] = useState<PromoteTo>("queen");
    const [isColorWhite, setIsColorWhite] = useState<boolean>(true);
    const [isWhitesOrientation, setIsWhitesOrientation] = useState<boolean>(true);
    const [kingsState, setKingsState] = useState<IKingState>(baseKingState);

    const data: IPhaserContext = {
        isWhitesTurn, setIsWhitesTurn, 
        moveHistory, setMoveHistory,
        captureHistory, setCaptureHistory,
        promoteTo, setPromoteTo,
        isColorWhite, setIsColorWhite,
        isWhitesOrientation, setIsWhitesOrientation,
        kingsState, setKingsState
    }

  return (
    <phaserContext.Provider value={data}>
        {children}
    </phaserContext.Provider>
  )
}

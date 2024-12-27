import { createContext, ReactNode, useState } from 'react'
import { IMoveHistory, ICaptureHistory, PromoteTo } from '../utils/types';

interface IPhaserContext{
    isWhitesTurn: boolean;
    moveHistory: IMoveHistory;
    captureHistory: ICaptureHistory;
    promoteTo: PromoteTo;
    isColorWhite: boolean
    setIsWhitesTurn: (val: boolean) => void;
    setMoveHistory: (val: IMoveHistory) => void;
    setCaptureHistory: (val: ICaptureHistory) => void;
    setPromoteTo: (val: PromoteTo) => void;
    setIsColorWhite: (val: boolean) => void;
}

interface PhaserContextProps{
    children: ReactNode
}

export const phaserContext = createContext<IPhaserContext>({
    isWhitesTurn: true, setIsWhitesTurn: () => {}
    , moveHistory: { white: [], black: [] }, setMoveHistory: () => {}
    , captureHistory: { white: [], black: [] }, setCaptureHistory: () => {}
    , promoteTo: "queen", setPromoteTo: () => {}
    , isColorWhite: true, setIsColorWhite: () => {}
})

export default function PhaserContext(
    {children} : PhaserContextProps
) {
    const [isWhitesTurn, setIsWhitesTurn] = useState(true);
    const [moveHistory, setMoveHistory] = useState<IMoveHistory>({ white: [], black: [] });
    const [captureHistory, setCaptureHistory] = useState<ICaptureHistory>({ white: [], black: [] });
    const [promoteTo, setPromoteTo] = useState<PromoteTo>("queen");
    const [isColorWhite, setIsColorWhite] = useState<boolean>(true);

    const data: IPhaserContext = {
        isWhitesTurn, setIsWhitesTurn, 
        moveHistory, setMoveHistory,
        captureHistory, setCaptureHistory,
        promoteTo, setPromoteTo,
        isColorWhite, setIsColorWhite
    }

  return (
    <phaserContext.Provider value={data}>
        {children}
    </phaserContext.Provider>
  )
}

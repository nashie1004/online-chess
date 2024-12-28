import { PieceNames } from "./constants";

export interface IPiece{
    name: PieceNames,
    x: number,
    y: number,
    uniqueName?: string
}

export interface IValidMove{
    x: number,
    y: number,
    isCapture: boolean
}

// export interface ISelectedPiece{
//     x: number,
//     y: number
// }
export type PromoteTo = "rook" | "knight" | "bishop" | "queen";

export interface IMoveInfo{
    x: number,
    y: number,
    pieceName: string
}

export interface IMove{
    old: IMoveInfo;
    new: IMoveInfo;
}

export interface IMoveHistory{
    white: IMove[];
    black: IMove[];
}   

export interface ICaptureHistory{
    white: IMoveInfo[]
    black: IMoveInfo[]
}

export interface IPhaserContextValues{
    isWhitesTurn: boolean;
    moveHistory: IMoveHistory;
    captureHistory: ICaptureHistory;
    promoteTo: PromoteTo;
    isColorWhite: boolean
}

export interface IPhaserContext extends IPhaserContextValues{
    setIsWhitesTurn: (val: boolean) => void;
    setMoveHistory: (val: IMoveHistory) => void;
    setCaptureHistory: (val: ICaptureHistory) => void;
    setPromoteTo: (val: PromoteTo) => void;
    setIsColorWhite: (val: boolean) => void;
}

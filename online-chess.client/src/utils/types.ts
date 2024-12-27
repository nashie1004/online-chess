import { PieceNames } from "./constants";

export interface IPiece{
    name: PieceNames,
    x: number,
    y: number
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
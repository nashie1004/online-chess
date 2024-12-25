import { PieceNames } from "./constants";

export interface IPiece{
    name: PieceNames,
    x: number,
    y: number
}

export interface IValidMove{
    x: number,
    y: number
}
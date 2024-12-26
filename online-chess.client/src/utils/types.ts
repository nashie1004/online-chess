import { GameObjects } from "phaser";
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

export interface ISelectedPiece{
    x: number,
    y: number
}

interface IMove{
    squareX: string,
    squareY: string,
    piece: string
}

export interface IMoveHistory{
    white: IMove[];
    black: IMove[];
}   
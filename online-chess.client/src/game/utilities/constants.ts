/*
import wPawn from "../../assets/pieces/wP.svg?raw"
import wRook from "../../assets/pieces/wR.svg?raw"
import wKnight from "../../assets/pieces/wN.svg?raw"
import wBishop from "../../assets/pieces/wB.svg?raw"
import wQueen from "../../assets/pieces/wQ.svg?raw"
import wKing from "../../assets/pieces/wK.svg?raw"

import bPawn from "../../assets/pieces/bP.svg?raw"
import bRook from "../../assets/pieces/bR.svg?raw"
import bKnight from "../../assets/pieces/bN.svg?raw"
import bBishop from "../../assets/pieces/bB.svg?raw"
import bQueen from "../../assets/pieces/bQ.svg?raw"
import bKing from "../../assets/pieces/bK.svg?raw"
*/
import wPawn from "../../assets/pieces/cburnett/wP.svg?raw"
import wRook from "../../assets/pieces/cburnett/wR.svg?raw"
import wKnight from "../../assets/pieces/cburnett/wN.svg?raw"
import wBishop from "../../assets/pieces/cburnett/wB.svg?raw"
import wQueen from "../../assets/pieces/cburnett/wQ.svg?raw"
import wKing from "../../assets/pieces/cburnett/wK.svg?raw"

import bPawn from "../../assets/pieces/cburnett/bP.svg?raw"
import bRook from "../../assets/pieces/cburnett/bR.svg?raw"
import bKnight from "../../assets/pieces/cburnett/bN.svg?raw"
import bBishop from "../../assets/pieces/cburnett/bB.svg?raw"
import bQueen from "../../assets/pieces/cburnett/bQ.svg?raw"
import bKing from "../../assets/pieces/cburnett/bK.svg?raw"
import { IKingState, IPiece, IPlayerInfo } from "./types"

export enum PieceNames{
    wPawn = "wPawn",
    wRook = "wRook",
    wKnight = "wKnight",
    wBishop = "wBishop",
    wQueen = "wQueen",
    wKing = "wKing",
    bPawn = "bPawn",
    bRook = "bRook",
    bKnight = "bKnight",
    bBishop = "bBishop",
    bQueen = "bQueen",
    bKing = "bKing"
}

export const Options = {
    tileSize: 100,
    width: 800,
    height: 800
}

export const pieceImages = {
    [PieceNames.wPawn]: wPawn,
    [PieceNames.wRook]: wRook,
    [PieceNames.wKnight]: wKnight,
    [PieceNames.wBishop]: wBishop,
    [PieceNames.wQueen]: wQueen,
    [PieceNames.wKing]: wKing,
    [PieceNames.bPawn]: bPawn,
    [PieceNames.bRook]: bRook,
    [PieceNames.bKnight]: bKnight,
    [PieceNames.bBishop]: bBishop,
    [PieceNames.bQueen]: bQueen,
    [PieceNames.bKing]: bKing,
};


const pieces: IPiece[] = [
    // 1.1. Black Officers
    { name: PieceNames.bRook, x: 0, y: 0 },
    { name: PieceNames.bKnight, x: 1, y: 0 },
    { name: PieceNames.bBishop, x: 2, y: 0 },
    { name: PieceNames.bQueen, x: 3, y: 0 },
    { name: PieceNames.bKing, x: 4, y: 0 },
    { name: PieceNames.bBishop, x: 5, y: 0 },
    { name: PieceNames.bKnight, x: 6, y: 0 },
    { name: PieceNames.bRook, x: 7, y: 0 },
    // 1.2. Black Pawns
    { name: PieceNames.bPawn, x: 0, y: 1 },
    { name: PieceNames.bPawn, x: 1, y: 1 },
    { name: PieceNames.bPawn, x: 2, y: 1 },
    { name: PieceNames.bPawn, x: 3, y: 1 },
    { name: PieceNames.bPawn, x: 4, y: 1 },
    { name: PieceNames.bPawn, x: 5, y: 1 },
    { name: PieceNames.bPawn, x: 6, y: 1 },
    { name: PieceNames.bPawn, x: 7, y: 1 },
    // 2.1 White Officers
    { name: PieceNames.wRook, x: 0, y: 7 },
    { name: PieceNames.wKnight, x: 1, y: 7 },
    { name: PieceNames.wBishop, x: 2, y: 7 },
    { name: PieceNames.wQueen, x: 3, y: 7 },
    { name: PieceNames.wKing, x: 4, y: 7 },
    { name: PieceNames.wBishop, x: 5, y: 7 },
    { name: PieceNames.wKnight, x: 6, y: 7 },
    { name: PieceNames.wRook, x: 7, y: 7 },
    // 2.2 White Pawns
    { name: PieceNames.wPawn, x: 0, y: 6 },
    { name: PieceNames.wPawn, x: 1, y: 6 },
    { name: PieceNames.wPawn, x: 2, y: 6 },
    { name: PieceNames.wPawn, x: 3, y: 6 },
    { name: PieceNames.wPawn, x: 4, y: 6 },
    { name: PieceNames.wPawn, x: 5, y: 6 },
    { name: PieceNames.wPawn, x: 6, y: 6 },
    { name: PieceNames.wPawn, x: 7, y: 6 },
]

export default pieces;


export const baseKingState: IKingState = { 
    white: { isCheckMate: false, isInCheck: false, checkedBy: [], isInStalemate: false }
    , black: { isCheckMate: false, isInCheck: false, checkedBy: [],  isInStalemate: false } 
};

export enum GameType{
    Classical = 1,
    Blitz3Mins = 2,
    Blitz5Mins = 3,
    Rapid10Mins = 4,
    Rapid25Mins = 5,
}

export enum GameStatus{
    Won, Lose, Draw
}

export enum ColorOptions{
    White = 1,
    Black = 2,
    Random = 3,
}

export const basePlayerInfo: IPlayerInfo = {
    userName: "",
    kingsState: { isCheckMate: false, isInCheck: false, checkedBy: [], isInStalemate: false },
    isPlayersTurn: false,
    timeLeft: 0,
    playerIsWhite: false,
    isOfferingADraw: false
}
import wPawn from "../assets/pieces/wP.svg?raw"
import wRook from "../assets/pieces/wR.svg?raw"
import wKnight from "../assets/pieces/wN.svg?raw"
import wBishop from "../assets/pieces/wB.svg?raw"
import wQueen from "../assets/pieces/wQ.svg?raw"
import wKing from "../assets/pieces/wK.svg?raw"

import bPawn from "../assets/pieces/bP.svg?raw"
import bRook from "../assets/pieces/bR.svg?raw"
import bKnight from "../assets/pieces/bN.svg?raw"
import bBishop from "../assets/pieces/bB.svg?raw"
import bQueen from "../assets/pieces/bQ.svg?raw"
import bKing from "../assets/pieces/bK.svg?raw"

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

export const gameOptions = {
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

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
import { IGameContextReducerState, IKingState, IPiece, IPlayerInfo } from "./types"

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
    isOfferingADraw: false,
    resign: false,
    promotePawnTo: "queen"
}

export const baseGameState: IGameContextReducerState = {
    messages: []
    ,gameRoomKey: null
    ,moveHistory: { white: [], black: [] }
    ,captureHistory: []
    ,myInfo: basePlayerInfo
    ,opponentInfo: basePlayerInfo
    ,gameStatus: "LOADING"
    ,gameType: GameType.Classical
};

/**
 * React to SignalR
 * SignalR to React
 */
export const lobbyPageHandlers = {
    onRefreshRoomList: "onRefreshRoomList"
    ,onInvalidRoomKey: "onInvalidRoomKey"
    ,onGetUserConnectionId: "onGetUserConnectionId"
    ,onGetRoomKey: "onGetRoomKey"
    ,onMatchFound: "onMatchFound"
}

export const lobbyPageInvokers = {
    getRoomList: "GetRoomList"
    ,getCreatedRoomKey: "GetCreatedRoomKey"
    ,deleteRoom: "DeleteRoom"
    ,addToQueue: "AddToQueue"
    ,joinRoom: "JoinRoom"
}

export const playPageHandlers = {
    onNotFound: "onNotFound"
    ,onInitializeGameInfo: "onInitializeGameInfo"
    ,onGameOver: "onGameOver"
    ,onReceiveMessages: "onReceiveMessages"
    ,onUpdateBoard: "onUpdateBoard"
    ,onOpponentDrawRequest: "onOpponentDrawRequest"
    ,onDeclineDraw: "onDeclineDraw"
    ,onUpdateTimer: "onUpdateTimer"
}

export const playPageInvokers = {
    gameStart: "GameStart"
    ,addMessageToRoom: "AddMessageToRoom"
    ,drawAgree: "DrawAgree"
    ,resign: "Resign"
    ,requestADraw: "RequestADraw"
    ,movePiece: "MovePiece"
}

/**
 * React to Phaser
 * Phaser to React
 */
export const eventEmit = {
    setKingsState: "setKingsState"
    ,setMovePiece: "setMovePiece"
    ,setEnemyMove: "setEnemyMove"
    ,setMoveHistory: "setMoveHistory"
}

export const eventOn = {
    setPromoteTo: "setPromoteTo"
    ,setKingsState: "setKingsState"
    ,setEnemyMove: "setEnemyMove"
    ,setMoveHistory: "setMoveHistory"
    ,setMovePiece: "setMovePiece"
}

export enum boardUI{
    blueMarble = "blueMarble"
    ,blue = "blue"
    ,blue2 = "blue2"
    ,blue3 = "blue3"
    ,brown = "brown"
    ,canvas2 = "canvas2"
    ,greenPlastic = "greenPlastic"
    ,green = "green"
    ,grey = "grey"
    ,horsey = "horsey"
    ,ic = "ic"
    ,leather = "leather"
    ,maple = "maple"
    ,maple2 = "maple2"
    ,marble = "marble"
    ,metal = "metal"
    ,ncf = "ncf"
    ,olive = "olive"
    ,pinkPyramid = "pinkPyramid"
    ,purpleDiag = "purpleDiag"
    ,purple = "purple"
    ,wood = "wood"
    ,wood2 = "wood2"
    ,wood3 = "wood3"
    ,wood4 = "wood4"
}

export enum pieceUI{
    alpha = "alpha"
    ,anarcandy = "anarcandy"
    ,caliente = "caliente"
    ,california = "california"
    ,cardinal = "cardinal"
    ,cburnett = "cburnett"
    ,celtic = "celtic"
    ,chess7 = "chess7"
    ,chessnut = "chessnut"
    ,companion = "companion"
    ,cooke = "cooke"
    ,disguised = "disguised"
    ,dubronovny = "dubronovny"
    ,fantasy = "fantasy"
    ,fresca = "fresca"
    ,gioco = "gioco"
    ,governor = "governor"
    ,horsey = "horsey"
    ,icpieces = "icpieces"
    ,kiwenSuwi = "kiwenSuwi"
    ,kosal = "kosal"
    ,leipzig = "leipzig"
    ,letter = "letter"
    ,maestro = "maestro"
    ,merida = "merida"
    ,monarchy = "monarchy"
    ,mono = "mono"
    ,mpchess = "mpchess"
    ,pirouetti = "pirouetti"
    ,pixel = "pixel"
    ,reillycraig = "reillycraig"
    ,riohacha = "riohacha"
    ,shapes = "shapes"
    ,spatial = "spatial"
    ,staunty = "staunty"
    ,tatiana = "tatiana"
}
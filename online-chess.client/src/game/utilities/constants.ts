import { IGameContextReducerState, IKingState, INotificationContextReducerState, IPiece, IPlayerInfo, PromotionPrefence } from "./types"

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

export const pieceNamesV2 = [
    { shortName: "wP", fullName: "wPawn" },
    { shortName: "wR", fullName: "wRook" },
    { shortName: "wN", fullName: "wKnight" },
    { shortName: "wB", fullName: "wBishop" },
    { shortName: "wQ", fullName: "wQueen" },
    { shortName: "wK", fullName: "wKing" },

    { shortName: "bP", fullName: "bPawn" },
    { shortName: "bR", fullName: "bRook" },
    { shortName: "bN", fullName: "bKnight" },
    { shortName: "bB", fullName: "bBishop" },
    { shortName: "bQ", fullName: "bQueen" },
    { shortName: "bK", fullName: "bKing" },
];


export const Options = {
    tileSize: 100,
    width: 800,
    height: 800
}

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
    userName: ""
    ,kingsState: { isCheckMate: false, isInCheck: false, checkedBy: [], isInStalemate: false }
    ,isPlayersTurn: false
    ,timeLeft: 0
    ,playerIsWhite: false
    ,isOfferingADraw: false
    ,resign: false
    ,promotePawnTo: PromotionPrefence.Queen
    ,openPromotionModal: false
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

export const baseNotificationState: INotificationContextReducerState = {
    customMessage: null
    ,customMessageType: "SUCCESS"
    ,hasAGameQueuing: false
    ,hasAGameDisconnected: false
    ,signalRConnectionDisconnected: false
    ,hasAGameOnGoing: false
    ,roomKey: null
    ,asOfDate: null 
}


  
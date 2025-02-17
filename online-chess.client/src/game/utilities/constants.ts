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


  
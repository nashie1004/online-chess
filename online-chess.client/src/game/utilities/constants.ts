import { IGameContextReducerState, INotificationContextReducerState } from "../../context/types";
import { IKing, IPlayerInfo } from "./types"

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

export enum GameType{
    Classical = 1,
    Blitz3Mins = 2,
    Blitz5Mins = 3,
    Rapid10Mins = 4,
    Rapid25Mins = 5,
}

export enum ColorOptions{
    White = 1,
    Black = 2,
    Random = 3,
}

export enum PromotionPrefence{
    Queen,
    Rook,
    Knight,
    Bishop
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

export const baseKing: IKing = { 
    isCheckMate: false, isInCheck: false, checkedBy: []
    , isInStalemate: false, x: -1, y: -1 
};

export const basePlayerInfo: IPlayerInfo = {
    userName: ""
    ,kingsState: baseKing
    ,isPlayersTurn: false
    ,timeLeft: 0
    ,playerIsWhite: false
    ,isOfferingADraw: false
    ,resign: false
    ,promotePawnTo: PromotionPrefence.Queen
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
    ,openOptionModal: false
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

export enum Castle{
    None,
    KingSide,
    QueenSide
}

export enum Capture{
    None,
    Normal,
    EnPassant
}

export enum EndGameStatus{
    CreatorIsCheckmated,
    CreatorResigned,
    CreatorTimeIsUp,

    JoinerIsCheckmated,
    JoinerResigned,
    JoinerTimeIsUp,

    DrawByAgreement,
    DrawByStalemate,
    DrawBothPlayerDisconnected,
    DrawBy50MoveRule,
    DrawByThreeFoldRepetition
}

export enum GameStatus{
    Won, Lose, Draw
}
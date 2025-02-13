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
    gameQueuingRoomKey: null
    ,hasAGameDisconnected: false
    ,hasAGameOnGoing: false
    ,roomKey: null
    ,asOfDate: null 
}

/**
 * React to SignalR
 * SignalR to React
 */
export const mainPageHandlers = {
    onGetUserConnectionId: "onGetUserConnectionId"
};

export const mainPageInvokers = {
    deleteRoom: "DeleteRoom"
};

export const authHandlers = {
    onRegister: "onRegister"
    ,onLogin: "onLogin"
    ,onIsSignedIn: "onIsSignedIn"
    ,onLogout: "onLogout"
};

export const authInvokers = {
    register: "Register"
    , login: "Login"
    , IsSignedIn: "IsSignedIn"
    , Logout: "Logout"
};

export const lobbyPageHandlers = {
    onRefreshRoomList: "onRefreshRoomList"
    ,onInvalidRoomKey: "onInvalidRoomKey"
    ,onGetRoomKey: "onGetRoomKey"
    ,onMatchFound: "onMatchFound"
}

export const lobbyPageInvokers = {
    getRoomList: "GetRoomList"
    ,getCreatedRoomKey: "GetCreatedRoomKey"
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
    ,onSetPromotionPreference: "onSetPromotionPreference"
}

export const playPageInvokers = {
    gameStart: "GameStart"
    ,addMessageToRoom: "AddMessageToRoom"
    ,drawAgree: "DrawAgree"
    ,resign: "Resign"
    ,requestADraw: "RequestADraw"
    ,movePiece: "MovePiece"
    ,setPromotionPreference: "SetPromotionPreference"
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
    ,setPromoteTo: "setPromoteTo"
}

export const eventOn = {
    setPromoteTo: "setPromoteTo"
    ,setKingsState: "setKingsState"
    ,setEnemyMove: "setEnemyMove"
    ,setMoveHistory: "setMoveHistory"
    ,setMovePiece: "setMovePiece"
}

export const boardUIArray = [
    { displayName: "Blue Marble", displayCode: "blue-marble.jpg" },
    { displayName: "Blue", displayCode: "blue.png" },
    { displayName: "Blue 2", displayCode: "blue2.jpg" },
    { displayName: "Blue 3", displayCode: "blue3.jpg" },
    { displayName: "Brown", displayCode: "brown.png" },
    { displayName: "Canvas 2", displayCode: "canvas2.jpg" },
    { displayName: "Green Plastic", displayCode: "green-plastic.png" },
    { displayName: "Green", displayCode: "green.png" },
    { displayName: "Grey", displayCode: "grey.jpg" },
    { displayName: "Horsey", displayCode: "horsey.jpg" },
    { displayName: "Ic", displayCode: "ic.png" },
    { displayName: "Leather", displayCode: "leather.jpg" },
    { displayName: "Maple", displayCode: "maple.jpg" },
    { displayName: "Maple 2", displayCode: "maple2.jpg" },
    { displayName: "Marble", displayCode: "marble.jpg" },
    { displayName: "Metal", displayCode: "metal.jpg" },
    { displayName: "Ncf", displayCode: "ncf-board.png" },
    { displayName: "Olive", displayCode: "olive.jpg" },
    { displayName: "Pink Pyramid", displayCode: "pink-pyramid.png" },
    { displayName: "Purple Diag", displayCode: "purple-diag.png" },
    { displayName: "Purple", displayCode: "purple.png" },
    { displayName: "Wood", displayCode: "wood.jpg" },
    { displayName: "Wood 2", displayCode: "wood2.jpg" },
    { displayName: "Wood 3", displayCode: "wood3.jpg" },
    { displayName: "Wood 4", displayCode: "wood4.jpg" }
];
  

export const pieceUIArray = [
    { displayName: "Alpha", displayCode: "alpha" },
    { displayName: "Anarcandy", displayCode: "anarcandy" },
    { displayName: "Caliente", displayCode: "caliente" },
    { displayName: "California", displayCode: "california" },
    { displayName: "Cardinal", displayCode: "cardinal" },
    { displayName: "Cburnett", displayCode: "cburnett" },
    { displayName: "Celtic", displayCode: "celtic" },
    { displayName: "Chess 7", displayCode: "chess7" },
    { displayName: "Chessnut", displayCode: "chessnut" },
    { displayName: "Companion", displayCode: "companion" },
    { displayName: "Cooke", displayCode: "cooke" },
    // { displayName: "Disguised", displayCode: "disguised" },
    // { displayName: "Dubronovny", displayCode: "dubronovny" },
    { displayName: "Fantasy", displayCode: "fantasy" },
    { displayName: "Fresca", displayCode: "fresca" },
    { displayName: "Gioco", displayCode: "gioco" },
    { displayName: "Governor", displayCode: "governor" },
    { displayName: "Horsey", displayCode: "horsey" },
    { displayName: "Ic Pieces", displayCode: "icpieces" },
    // { displayName: "Kiwensuwi", displayCode: "kiwenSuwi" },
    { displayName: "Kosal", displayCode: "kosal" },
    { displayName: "Leipzig", displayCode: "leipzig" },
    { displayName: "Letter", displayCode: "letter" },
    { displayName: "Maestro", displayCode: "maestro" },
    { displayName: "Merida", displayCode: "merida" },
    { displayName: "Monarchy", displayCode: "monarchy" },
    // { displayName: "Mono", displayCode: "mono" },
    { displayName: "Mpchess", displayCode: "mpchess" },
    { displayName: "Pirouetti", displayCode: "pirouetti" },
    { displayName: "Pixel", displayCode: "pixel" },
    { displayName: "Reillycraig", displayCode: "reillycraig" },
    { displayName: "Riohacha", displayCode: "riohacha" },
    { displayName: "Shapes", displayCode: "shapes" },
    { displayName: "Spatial", displayCode: "spatial" },
    { displayName: "Staunty", displayCode: "staunty" },
    { displayName: "Tatiana", displayCode: "tatiana" }
  ];
  
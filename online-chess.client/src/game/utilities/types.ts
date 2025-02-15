import { GameObjects } from "phaser";
import { ColorOptions, GameStatus, GameType, PieceNames } from "./constants";

export interface IBaseCoordinates{
    x: number;
    y: number;
}

export interface IPiece extends IBaseCoordinates{
    name: PieceNames,
    uniqueName?: string
}

export interface IValidMove extends IBaseCoordinates{
    isCapture: boolean
}

export type PromoteTo = "rook" | "knight" | "bishop" | "queen";

export enum PromotionPrefence{
    Queen,
    Rook,
    Knight,
    Bishop
}

export interface IMoveInfo extends IBaseCoordinates{
    pieceName: string
}

export interface IPieceMove{
    old: IPiece;
    new: IPiece;
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

export interface IKing{
    isInCheck: boolean;
    checkedBy: IBaseCoordinates[];
    isCheckMate: boolean;
    isInStalemate: boolean;
}

export interface IKingState{
    white: IKing;
    black: IKing;
}

export interface ITimer{
    white: number;
    black: number;
    isWhitesTurn: boolean;
}

export interface ISignalRContext {
    startConnection: () => Promise<boolean>;
    stopConnection: () => void;
    invoke: (methodName: string, ...args: any[]) => void;
    addHandler: (methodName: string, method: (...args: any[]) => void) => void;
    removeHandler: (methodName: string) => void;
    userConnectionId: string | null;
    setUserConnectionId: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface IBothKingsPosition{
    white: IBaseCoordinates;
    black: IBaseCoordinates;
}

export interface INonTilePieces extends IBaseCoordinates{
    sprite: GameObjects.Sprite
}

export interface IPinMove {
    isEnemy: boolean;
    isFriend: boolean;
    isEmptyTile: boolean;
    coords: IBaseCoordinates;
}

export interface IPinInfo {
    isPinned: boolean;
    // 1. null means piece is not pinned, 2. number if pinned by enemy rook or queen 2. array if pinned by enemy bishop or queen
    restrictedToCol: null | number | number[]; 
    restrictedToRow: null | number | number[];
    isRook: boolean;
}

export interface IGameRoomValue{
    createdByUserId: string | number;
    createDate: Date,
    gameType: GameType;
    createdByUserColor: ColorOptions;
    joinedByUserId: string | number;

}

export interface IGameRoom{
    key: string,
    value: IGameRoomValue
}

export interface IChat{
    createdByUser: string;
    createDate: Date;
    message: string;
}

export interface IGameRoomList{
    list: IGameRoom[];
    isLoading: boolean;
}

export interface IUser {
    userName: string;
    profileURL: string; // TODO
}

export interface ILeaderboard{
    rank: number;
    userName: string;
    wins: number;
    loses: number;
    draws: number;
    sinceDate: Date;
    lastGameDate: Date;
}

export interface ILeaderboardList{
    isLoading: boolean;
    data: ILeaderboard[];
}

interface IGameType{
    rank: number;
    username: string;
    wins: number;
    loses: number;
    draws: number;
    lastGameDate: Date;
}

export interface IGameTypeList{
    isLoading: boolean;
    data: IGameType[];
}

export interface IGameHistory{
    indexNo: number;
    gameStatus: GameStatus;
    isColorWhite: boolean;
    gameType: GameType;
    opponentName: string;
    gameDate: Date;
}

export interface IGameHistoryList{
    isLoading: boolean;
    data: IGameHistory[];
}

interface IInitialPlayerInfo{
    userName: string;
    isPlayersTurnToMove: boolean;
    timeLeft: string; 
    isColorWhite: boolean;
    kingInCheck: boolean;
    kingInCheckMate: boolean;
    kingInStaleMate: boolean;
}

export interface IInitialGameInfo{
    gameRoomKey: string;
    lastMoveInfo: IPiece;
    lastCapture: string | null;
    moveCount: number;
    createdByUserInfo: IInitialPlayerInfo;
    joinedByUserInfo: IInitialPlayerInfo;
    gameType: GameType
}

export interface IPiecesCoordinates{
    white: IPiece[];
    black: IPiece[];
}

/**
 * Global state for both players
 * 
 * {
 * 
 *  name: "player1",
 *  kingsState: {
 *     isCheckMate: false, isInCheck: false, checkedBy: [], isInStalemate: false 
 *  },
 *  isPlayersTurn: false,
 *  timeInfo: {},
 *  playerIsWhite: false
 * 
 * }
 * 
 */

type gameStat = "ONGOING" | "PAUSED" | "LOADING" | "FINISHED";

export interface IPlayerInfo{
    userName: string;
    kingsState: IKing;
    isPlayersTurn: boolean;
    timeLeft: number;
    playerIsWhite: boolean;
    isOfferingADraw: boolean;
    resign: boolean;
    promotePawnTo: PromotionPrefence;
    openPromotionModal: boolean
}

export interface IGameContextReducerState{
    messages: IChat[];
    gameRoomKey: string | null;
    moveHistory: IMoveHistory;
    captureHistory: IPiece[];
    myInfo: IPlayerInfo;
    opponentInfo: IPlayerInfo;
    gameStatus: gameStat;
    gameType: GameType;
}

export type IGameContextReducerActions = 
| { type: "SET_MESSAGES"; payload: IChat[] }
| { type: "SET_GAMEROOMKEY"; payload: string }
| { type: "SET_MOVEHISTORY"; payload: any } 
| { type: "SET_CAPTUREHISTORY"; payload: IPiece }

| { type: "SET_MYINFO"; payload: IPlayerInfo }
| { type: "SET_MYINFO_TIMELEFT"; payload: number }
| { type: "SET_MYINFO_PROMOTEPAWNTO"; payload: PromotionPrefence }
| { type: "SET_MYINFO_ISPLAYERSTURN"; payload: boolean } 
| { type: "SET_MYINFO_OPENPROMOTIONMODAL"; payload: boolean } 
| { type: "SET_OPPONENTINFO"; payload: IPlayerInfo }
| { type: "SET_OPPONENTINFO_TIMELEFT"; payload: number }
| { type: "SET_OPPONENTINFO_PROMOTEPAWNTO"; payload: PromotionPrefence } 
| { type: "SET_OPPONENTINFO_ISPLAYERSTURN"; payload: boolean } 

| { type: "SET_GAMESTATUS"; payload: gameStat }
| { type: "SET_CLEARGAMESTATE"; }
| { type: "SET_OPPONENTINFO_REQUESTDRAW"; payload: boolean }
| { type: "SET_GAMETYPE"; payload: GameType };

export interface IGameContext{
    gameState: IGameContextReducerState;
    setGameState: React.Dispatch<IGameContextReducerActions>;
}

export interface PromoteOptions{
    name: PromotionPrefence;
    assetURL: string;
}

export interface PlayersPromotePreference{
    white: PromotionPrefence;
    black: PromotionPrefence;
}

export interface INotificationContext{
    notificationState: INotificationContextReducerState;
    setNotificationState: React.Dispatch<INotificationContextReducerActions>;
}

export type customMessageType = "INFO" | "SUCCESS" | "DANGER";
export interface ICustomMesage {
    customMessage: string | null;
    customMessageType: customMessageType;
};

export interface INotificationContextReducerState{
    customMessage: string | null;
    customMessageType: customMessageType;
    gameQueuingRoomKey: string | null;
    hasAGameDisconnected: boolean;
    signalRConnectionDisconnected: boolean;
    hasAGameOnGoing: boolean;
    roomKey: string | null;
    asOfDate: Date | null;
}

export type INotificationContextReducerActions = 
{ type: "SET_CUSTOMMESSAGE", payload: ICustomMesage }
| { type: "SET_GAMEQUEUINGROOMKEY", payload: string | null }
| { type: "SET_HASAGAMEDISCONNECTED", payload: boolean }
| { type: "SET_SIGNALRCONNECTIONDISCONNECTED", payload: boolean }
| { type: "SET_HASAGAMEONGOING", payload: boolean }
| { type: "SET_ROOMKEY", payload: string }
| { type: "SET_ASOFDATE", payload: Date }
| { type: "SET_RESETNOTIFICATIONS" }
;
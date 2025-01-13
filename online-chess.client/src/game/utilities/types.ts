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

export interface IMoveInfo extends IBaseCoordinates{
    pieceName: string
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
}

export interface IKingState{
    white: IKing;
    black: IKing;
}

export interface ITimer{
    white: number;
    black: number;
}

export interface IPhaserContextValues{
    isWhitesTurn: boolean;
    moveHistory: IMoveHistory;
    captureHistory: ICaptureHistory;
    promoteTo: PromoteTo;
    isColorWhite: boolean;
    isWhitesOrientation: boolean;
    kingsState: IKingState;
}

export interface IPhaserContext extends IPhaserContextValues{
    setIsWhitesTurn: (val: boolean) => void;
    setMoveHistory: (val: IMoveHistory) => void;
    setCaptureHistory: (val: ICaptureHistory) => void;
    setPromoteTo: (val: PromoteTo) => void;
    setIsColorWhite: (val: boolean) => void;
    setIsWhitesOrientation: (val: boolean) => void;
    setKingsState: (val: IKingState) => void;
}

export interface IGameContextValues{
    timer: ITimer;
    messages: IMessage[]
}

export interface IGameContext extends IGameContextValues{
    setTimer: React.Dispatch<React.SetStateAction<ITimer>>;
    setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
}

export interface ISignalRContext {
    startConnection: (closeEventCallback: (arg: any) => void) => void;
    stopConnection: () => void;
    invoke: (methodName: string, ...args: any[]) => void;
    addHandler: (methodName: string, method: (...args: any[]) => void) => void;
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

export interface IMessage{
    message: string;
    createDate: Date;
    createdByUserId: string | number;
}

export interface IGameRoomList{
    list: IGameRoom[];
    isLoading: boolean;
}

export interface IUser {
    userName: string;
    connectionId: string | null;
}

export interface ILeaderboard{
    userName: string;
    wins: number;
    loses: number;
    draws: number;
    lastGameDate: Date;
}

export interface ILeaderboardList{
    isLoading: boolean;
    data: ILeaderboard[];
}

export interface IGameHistory{
    gameStatus: GameStatus;
    isColorWhite: boolean;
    opponentName: string;
    createDate: Date;
}

export interface IGameHistoryList{
    isLoading: boolean;
    data: IGameHistory[];
}
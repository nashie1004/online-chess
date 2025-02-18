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

export interface IPiecesCoordinates{
    white: IPiece[];
    black: IPiece[];
}

export type gameStat = "ONGOING" | "PAUSED" | "LOADING" | "FINISHED";

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

export interface PromoteOptions{
    name: PromotionPrefence;
    assetURL: string;
}

export interface PlayersPromotePreference{
    white: PromotionPrefence;
    black: PromotionPrefence;
}

export type customMessageType = "INFO" | "SUCCESS" | "DANGER";
export interface ICustomMesage {
    customMessage: string | null;
    customMessageType: customMessageType;
};

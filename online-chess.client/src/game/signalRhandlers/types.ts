import { GameType, PromotionPrefence } from "../utilities/constants";
import { IPiece, IMoveInfo, IBaseCoordinates, IPieceMove } from "../utilities/types";

export interface IInitialPlayerInfo{
    userName: string;
    isPlayersTurnToMove: boolean;
    timeLeft: string; 
    isColorWhite: boolean;
    kingInCheck: boolean;
    kingInCheckMate: boolean;
    kingInStaleMate: boolean;
    pawnPromotionPreference: PromotionPrefence;
}

export interface IUseOnInitializeGameInfo{
    gameRoomKey: string;
    lastMoveInfo: IPiece;
    lastCapture: string | null;
    moveCount: number;
    createdByUserInfo: IInitialPlayerInfo;
    joinedByUserInfo: IInitialPlayerInfo;
    gameType: GameType;
    piecesCoordinatesInitial: IPiece[];
    bothKingsCoords: IBaseCoordinates;
}

export interface IOnSetPromotionPreference{
    playerName: string;
    preference: PromotionPrefence;
}

export interface IOnUpdateBoard{
    moveInfo: IPieceMove;
    moveIsWhite: boolean;
    capturedPiece: IPiece | null;
}

export interface IOnReceiveMessages{
    createdByUser: string;
    createDate: Date;
    message: string;
}
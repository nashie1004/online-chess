import { Capture, Castle, GameType, PromotionPrefence } from "../utilities/constants";
import { IPiece, IPieceMove, IKingState } from "../utilities/types";

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
    moveCountSinceLastCapture: number;
    createdByUserInfo: IInitialPlayerInfo;
    joinedByUserInfo: IInitialPlayerInfo;
    gameType: GameType;
    piecesCoordinatesInitial: IPiece[];
    bothKingsState: IKingState;
    reconnect: boolean;
    whiteKingHasMoved: boolean;
    blackKingHasMoved: boolean;
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

// TODO
export interface IMovePiece{
    gameRoomKey: string | null;
    oldMove: IPiece;
    newMove: IPiece;
    capture: Capture;
    castle: Castle;
}
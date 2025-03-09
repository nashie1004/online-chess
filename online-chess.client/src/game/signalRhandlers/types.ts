import { Capture, Castle, ColorOptions, GameType, PromotionPrefence } from "../utilities/constants";
import { IPiece, IPieceMove, IKingState, IMoveHistory, IKing } from "../utilities/types";

export interface IInitialPlayerInfo{
    userName: string;
    isPlayersTurnToMove: boolean;
    timeLeft: string; 
    isColorWhite: boolean;
    kingInCheck: boolean;
    kingInCheckMate: boolean;
    kingInStaleMate: boolean;
    pawnPromotionPreference: PromotionPrefence;
    profileImageUrl: string;
    color: ColorOptions;
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
    moveHistory: IMoveHistory;
    captureHistory: IPiece[];
}

export interface IOnSetPromotionPreference{
    playerName: string;
    preference: PromotionPrefence;
}

export interface IOnUpdateBoard{
    moveInfo: IPieceMove;
    moveIsWhite: boolean;
    creatorColorIsWhite: boolean;
    capturedPiece: IPiece | null;
    moveHistoryLatestMove: IPieceMove;
    bothKingsState: IKingState;
}

export interface IOnReceiveMessages{
    createdByUser: string;
    createDate: Date;
    message: string;
}

export interface IMovePiece{
    gameRoomKey: string | null;
    oldMove: IPiece;
    newMove: IPiece;
    capture: Capture;
    castle: Castle;
    kingsState: IKingState;
    promote: boolean;
}
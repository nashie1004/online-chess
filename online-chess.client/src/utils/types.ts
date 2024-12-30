import { PieceNames } from "./constants";

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
    checkedBy: IBaseCoordinates | null;
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

export interface IReactContextValues{
    timer: ITimer;
}

export interface IReactContext extends IReactContextValues{
    setTimer: React.Dispatch<React.SetStateAction<ITimer>>;
}

export interface IBothKingsPosition{
    white: IBaseCoordinates;
    black: IBaseCoordinates;
}
export type PieceName = 
    "wPawn" | "wRook" | "wKnight" | "wBishop"
    | "wQueen" | "wKing" | "bPawn" | "bRook"
    | "bKnight" | "bBishop" | "bQueen" | "bKing"

export interface IPiece{
    name: PieceName,
    x: number,
    y: number
}
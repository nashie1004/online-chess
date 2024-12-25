interface IPiece{
    name: string,
    x: number,
    y: number
}

const pieces: IPiece[] = [
    // 1.1. Black Officers
    { name: "bRook", x: 0, y: 0 },
    { name: "bKnight", x: 1, y: 0 },
    { name: "bBishop", x: 2, y: 0 },
    { name: "bQueen", x: 3, y: 0 },
    { name: "bKing", x: 4, y: 0 },
    { name: "bBishop", x: 5, y: 0 },
    { name: "bKnight", x: 6, y: 0 },
    { name: "bRook", x: 7, y: 0 },
    // 1.2. Black Pawns
    { name: "bPawn", x: 0, y: 1 },
    { name: "bPawn", x: 1, y: 1 },
    { name: "bPawn", x: 2, y: 1 },
    { name: "bPawn", x: 3, y: 1 },
    { name: "bPawn", x: 4, y: 1 },
    { name: "bPawn", x: 5, y: 1 },
    { name: "bPawn", x: 6, y: 1 },
    { name: "bPawn", x: 7, y: 1 },
    // 2.1 White Officers
    { name: "wRook", x: 0, y: 7 },
    { name: "wKnight", x: 1, y: 7 },
    { name: "wBishop", x: 2, y: 7 },
    { name: "wQueen", x: 3, y: 7 },
    { name: "wKing", x: 4, y: 7 },
    { name: "wBishop", x: 5, y: 7 },
    { name: "wKnight", x: 6, y: 7 },
    { name: "wRook", x: 7, y: 7 },
    // 2.2 White Pawns
    { name: "wPawn", x: 0, y: 6 },
    { name: "wPawn", x: 1, y: 6 },
    { name: "wPawn", x: 2, y: 6 },
    { name: "wPawn", x: 3, y: 6 },
    { name: "wPawn", x: 4, y: 6 },
    { name: "wPawn", x: 5, y: 6 },
    { name: "wPawn", x: 6, y: 6 },
    { name: "wPawn", x: 7, y: 6 },
]

export default pieces;
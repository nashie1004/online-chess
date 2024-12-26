import { GameObjects } from "phaser";
import { PieceNames } from "../utils/constants";
import { IMoveHistory, IMoveInfo, IValidMove } from "../utils/types";

/**
 * Helper class for validating moves
 * - shows available preview moves
 */
export default class MoveValidator{
    private readonly board: (GameObjects.Sprite | null)[][] = []
    private readonly pieceName: PieceNames = PieceNames.wPawn;
    private readonly moveHistory: IMoveHistory;

    constructor(board: (GameObjects.Sprite | null)[][], pieceName: PieceNames, moveHistory: IMoveHistory) {
        this.board = board;
        this.pieceName = pieceName;
        this.moveHistory = moveHistory;
    }

    public rook(x: number, y: number): IValidMove[]{
        const validMoves: IValidMove[] = [];

        /**
         * Top: 0, -y
         * Left: -x, 0
         * Right: +x, 0
         * Bottom: 0, +y
         */

        const directions = [
            { x: 0, y: -1 },
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
        ]

        directions.forEach(direction => {
            
            let row = y
            let col = x
            
            while (row >= 0 && row <= 7 && col >= 0 && col <= 7 ){
                row += direction.y;
                col += direction.x;
                if (row === y && col === x) continue; // same tile
                if (this.isOutOfBounds(col, row)) break; // out of bounds
    
                const currTile = this.board[col][row];
    
                if (currTile){
                    if(this.isAFriendPiece(currTile.name)){
                        break;
                    }
                    else{
                        validMoves.push({ x: col, y: row, isCapture: true })
                        break;
                    }
                }
    
                validMoves.push({ x: col, y: row, isCapture: false })
            }
        })

        return validMoves;
    }

    public knight(x: number, y: number): IValidMove[]{
        const validMoves: IValidMove[] = [];
        
        /**
         * top left 1 = x: -1, y: -2
         * top left 2 = x: -2, y: -1
         * bottom left 1 = x: -2, y: +1
         * bottom left 2 = x: -1, y: +2
         * top right 1 = x: +1, y: -2
         * top right 2 = x: +2, y: -1
         * bottom right 1 = x: +2, y: +1
         * bottom right 2 = x: +1, y: 2
         */
        const directions = [
            { x: -1, y: -2 } 
            ,{ x: -2, y: -1 } 
            ,{ x: -2, y: 1 } 
            ,{ x: -1, y: 2 } 
            ,{ x: 1, y: -2 } 
            ,{ x: 2, y: -1 } 
            ,{ x: 2, y: 1 } 
            ,{ x: 1, y: 2 } 
        ]

        directions.forEach(direction => {

            const col = x + direction.x
            const row = y + direction.y

            // check if out of bounds
            if (this.isOutOfBounds(col, row)) return;

            const currTile = this.board[col][row];

            if (currTile){
                if (this.isAFriendPiece(currTile.name)){
                    return;
                }
                else{
                    validMoves.push({ x: col, y: row, isCapture: true })
                    return;
                }
            }

            validMoves.push({ x: col, y: row, isCapture: false })
        })
        
        return validMoves;
    }
    
    public bishop(x: number, y: number): IValidMove[]{
        const validMoves: IValidMove[] = [];

        const directions = [
            { x: -1, y: -1 } // Top Left: -x, -y
            ,{ x: -1, y: 1 } // Bottom Left: -x, +y
            ,{ x: 1, y: -1 } // Top Right: +x, -y
            ,{ x: 1, y: 1 } // Bottom Right: +x, +y
        ]

        directions.forEach(direction => {
            let row = 0;
            let col = 0;
    
            row = y;
            col = x;
            while (row >= 0 && col >= 0 && row <= 7 && col <= 7){
                row += direction.y;
                col += direction.x;

                // still within the board
                if (this.isOutOfBounds(col, row)) continue;

                const currTile = this.board[col][row]

                if (
                    (col !== x && row !== y) // Not the actual square
                    &&
                    currTile // Square is occupied
                ){
                    if (this.isAFriendPiece(currTile.name)){ // a friend
                        break;
                    } 
                    else{
                        validMoves.push({ x: col, y: row, isCapture: true }) // an opponent
                        break;
                    }
                }
                
                validMoves.push({ x: col, y: row, isCapture: false})
            }
        })

        return validMoves;
    }
    
    public queen(x: number, y: number): IValidMove[]{
        let validMoves: IValidMove[] = [];
        
        validMoves = [...this.rook(x, y), ...this.bishop(x, y)]

        return validMoves;
    }
    
    public king(x: number, y: number): IValidMove[]{
        const validMoves: IValidMove[] = [];
        
        /**
         * top left = -1, -1
         * top mid = 0, -1
         * top right = 1, -1
         * mid left = -1, 0
         * mid right = 1, 0
         * bottom left = -1, 1
         * bottom mid = 0, 1
         * bottom right = 1, 1
         */
        const directions = [
            { x: -1, y: -1 }
            ,{ x: 0, y: -1 }
            ,{ x: 1, y: -1 }
            ,{ x: -1, y: 0 }
            ,{ x: 1, y: 0 }
            ,{ x: -1, y: 1 }
            ,{ x: 0, y: 1 }
            ,{ x: 1, y: 1 }
        ]

        directions.forEach(direction => {
            const col = x + direction.x;
            const row = y + direction.y;

            if (this.isOutOfBounds(col, row)) return; // out of bounds

            const currTile = this.board[col][row];

            if (currTile){
                // friend
                if (this.isAFriendPiece(currTile.name)) return;

                // opponent
                validMoves.push({ x: col, y: row, isCapture: true })
                return;
            }

            validMoves.push({ x: col, y: row, isCapture: false })
        })

        return validMoves;
    }
    
    public pawn(x: number, y: number): IValidMove[]{
        const validMoves: IValidMove[] = [];
        const isWhite = this.pieceName.toString()[0] === "w";
        const captureYDirection = isWhite ? -1 : 1;
        
        // 1. normal 1 square forward
        if (y <= 7 || y >= 0){
            const col = x;
            const row = y + (captureYDirection * 1);

            // block pawn from moving
            if (!this.board[col][row]) validMoves.push({ x: col, y: row, isCapture: false });

        }

        // 2. one time only 2 squares forward
        if (
            (y <= 7 || y >= 0) &&
            (isWhite && y === 6) ||
            (!isWhite && y === 1)
        ){
            const col = x;
            const row = y + (captureYDirection * 2);

            // block pawn from moving
            const blockage = this.board[col][y + (captureYDirection * 1)]
            if (!blockage) {
                validMoves.push({ x: col, y: row, isCapture: false });
            }

        }

        // 3. check diagonal capture
        let captureDirection = [
            { x: -1, y: captureYDirection } // top left
            ,{ x: 1, y: captureYDirection } // top right
        ]

        captureDirection.forEach(direction => {
            const row = y + direction.y;
            const col = x + direction.x;
            
            if (
                col >= 0 && col >= 0 
                &&
                row <= 7 && row <= 7
            ){
                if (this.isOutOfBounds(col, row)) return;

                const currTile = this.board[col][row]

                if (currTile && !this.isAFriendPiece(currTile.name)) 
                {
                    validMoves.push({ x: col, y: row, isCapture: true });
                }
            }
        })

        // 4. en passant
        
        // get the opponent's latest move and
        // if both sides already have 1 move
        if (
            this.moveHistory.black.length > 0 && this.moveHistory.white.length > 0  
        ){
            let latestMove: IMoveInfo;
            if (isWhite){
                latestMove = this.moveHistory.black[this.moveHistory.black.length - 1].new
            } else {
                latestMove = this.moveHistory.white[this.moveHistory.white.length - 1].new
            }
    
            // if the latest move is a pawn, and the row is 3 (for white) or 5 (for black)
            // allow capture
            if (
                ((latestMove.y === 3 && isWhite) || (latestMove.y === 4 && !isWhite))
                && latestMove.pieceName.toLowerCase().indexOf("pawn")
            ){
                validMoves.push({ x: latestMove.x, y: y + captureYDirection, isCapture: true });
                console.log(validMoves[validMoves.length - 1])
            }
        }

        return validMoves;
    }

    private isAFriendPiece(name: string): boolean{
        const bothWhite = name[0] === "w" && this.pieceName.toString()[0] === "w";
        const bothBlack = name[0] === "b" && this.pieceName.toString()[0] === "b";

        return bothWhite || bothBlack;
    }

    private isOutOfBounds(col: number, row: number){
        return col > 7 || row > 7 || 0 > col || 0 > row;
    }
}
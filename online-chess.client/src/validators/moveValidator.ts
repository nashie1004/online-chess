import { GameObjects } from "phaser";
import { PieceNames } from "../utils/constants";
import { IValidMove } from "../utils/types";

/**
 * Helper class for validating moves
 * - shows available preview moves
 */
export default class MoveValidator{
    private readonly board: (GameObjects.Sprite | null)[][] = []
    private readonly pieceName: PieceNames = PieceNames.wPawn;

    constructor(board: (GameObjects.Sprite | null)[][], pieceName: PieceNames) {
        this.board = board;
        this.pieceName = pieceName;
    }

    rook(x: number, y: number): IValidMove[]{
        const retVal: IValidMove[] = [];

        /**
         * Top: 0, -y
         * Left: -x, 0
         * Right: +x, 0
         * Bottom: 0, +y
         */

        let row = 0
        let col = 0
        
        // Top
        row = y;
        col = x;
        while (row >= 0 && row <= 7){
            row--;
            if (row === y && col === x) continue;
            if (row < 0 || row >= 8) break;

            const currTile = this.board[col][row];

            if (currTile){
                console.log(currTile)
                if(this.isAFriendPiece(currTile.name)){
                    break;
                }
                else{
                    retVal.push({ x: col, y: row })
                    break;
                }
            }

            retVal.push({ x: col, y: row })
        }

        return retVal;
    }


    knight(x: number, y: number): IValidMove[]{
        const retVal: IValidMove[] = [];
        
        this.board.forEach((rows, rowIdx) => {
            rows.forEach((_, colIdx) => {
                // TODO
            })
        });

        return retVal;
    }
    
    bishop(x: number, y: number): IValidMove[]{
        const retVal: IValidMove[] = [];

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

                // still at within the board
                if (row < 0 || col < 0 || row >= 8 || col >= 8) continue;

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
                        retVal.push({ x: col, y: row}) // an opponent
                        break;
                    }
                }
                
                retVal.push({ x: col, y: row})
            }
        })

        return retVal;
    }
    
    queen(x: number, y: number): IValidMove[]{
        let retVal: IValidMove[] = [];
        
        retVal = [...this.rook(x, y)]
        retVal = [...retVal, ...this.bishop(x, y)]

        return retVal;
    }
    
    king(x: number, y: number): IValidMove[]{
        const retVal: IValidMove[] = [];
        
        this.board.forEach((rows, rowIdx) => {
            rows.forEach((_, colIdx) => {
                // TODO
            })
        });

        return retVal;
    }
    
    pawn(x: number, y: number): IValidMove[]{
        const retVal: IValidMove[] = [];
        
        this.board.forEach((rows, rowIdx) => {
            rows.forEach((_, colIdx) => {
                // TODO
            })
        });

        return retVal;
    }

    private isAFriendPiece(name: string): boolean{
        const whitePieces = [
            PieceNames.wRook.toString(), PieceNames.wKnight.toString(), PieceNames.wBishop.toString()
            ,PieceNames.wQueen.toString(), PieceNames.wKing.toString(), PieceNames.wPawn.toString()
        ]

        return whitePieces.includes(this.pieceName.toString()) && whitePieces.includes(name.toString());
    }
}
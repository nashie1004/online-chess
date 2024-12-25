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
                if (row < 0 || row >= 8 || col < 0 || col >= 8) break; // out of bounds
    
                const currTile = this.board[col][row];
    
                if (currTile){
                    if(this.isAFriendPiece(currTile.name)){
                        break;
                    }
                    else{
                        retVal.push({ x: col, y: row, isCapture: true })
                        break;
                    }
                }
    
                retVal.push({ x: col, y: row, isCapture: false })
            }
        })

        return retVal;
    }

    knight(x: number, y: number): IValidMove[]{
        const retVal: IValidMove[] = [];
        
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
            if (col >= 8 || row >= 8 || col < 0 || row < 0) return;

            const currTile = this.board[col][row];

            if (currTile){
                if (this.isAFriendPiece(currTile.name)){
                    return;
                }
                else{
                    retVal.push({ x: col, y: row, isCapture: true })
                    return;
                }
            }

            retVal.push({ x: col, y: row, isCapture: false })
        })
        
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

                // still within the board
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
                        retVal.push({ x: col, y: row, isCapture: true }) // an opponent
                        break;
                    }
                }
                
                retVal.push({ x: col, y: row, isCapture: false})
            }
        })

        return retVal;
    }
    
    queen(x: number, y: number): IValidMove[]{
        let retVal: IValidMove[] = [];
        
        retVal = [...this.rook(x, y), ...this.bishop(x, y)]

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
        const bothWhite = name[0] === "w" && this.pieceName.toString()[0] === "w"
        const bothBlack = name[0] === "b" && this.pieceName.toString()[0] === "b"

        return bothWhite || bothBlack
    }
}
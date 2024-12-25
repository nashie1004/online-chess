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

        this.board.forEach((rows, rowIdx) => {
            rows.forEach((_, colIdx) => {
                if (rowIdx === y){
                    retVal.push({ x: colIdx, y: rowIdx });
                }
                if (colIdx === x){
                    retVal.push({ x: colIdx, y: rowIdx });
                }
            })
        });
        
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

        let row = 0;
        let col = 0;

        // Top Left: -x, -y
        row = y;
        col = x;
        while (row >= 0 && col >= 0){
            retVal.push({ x: col, y: row})
            row--;
            col--;
        }
        
        // Bottom Left: -x, +y
        row = y;
        col = x;
        while (row <= 7 && col >= 0){
            retVal.push({ x: col, y: row})
            row++;
            col--;
        }
        
        // Top Right: +x, -y
        row = y;
        col = x;
        while (row >= 0 && col <= 7){
            retVal.push({ x: col, y: row})
            row--;
            col++;
        }
        
        // Bottom Right: +x, +y
        row = y;
        col = x;
        while (row <= 7 && col <= 7){
            retVal.push({ x: col, y: row})
            row++;
            col++;
        }

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
}
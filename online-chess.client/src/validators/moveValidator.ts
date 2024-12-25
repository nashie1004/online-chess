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
        
        let rowCount = 0;
        let colCount = 0;

        this.board.forEach((rows, rowIdx) => {
            rows.forEach((_, colIdx) => {
                /**
                 * - Top Left: -x, -y
                 * - Bottom Left: -x, +y
                 * - Top Right: +x, -y
                 * - Bottom Right: +x, +y
                 */


                // current: 4, 4
                // top left
                if (colIdx - 1 >= 0 && rowIdx - 1 >= 0){
                    // this.board[colIdx][rowIdx]
                    retVal.push({ x: colIdx - 1, y: rowIdx - 1  })

                    rowCount--;
                    colCount--;
                }
            })
        });

        return retVal;
    }
    
    queen(x: number, y: number): IValidMove[]{
        const retVal: IValidMove[] = [];
        
        this.board.forEach((rows, rowIdx) => {
            rows.forEach((_, colIdx) => {
                // TODO
            })
        });

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
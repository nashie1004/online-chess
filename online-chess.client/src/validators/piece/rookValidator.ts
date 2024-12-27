import { GameObjects } from "phaser";
import { IMoveHistory, IPiece, IValidMove } from "../../utils/types";
import BasePieceValidator from "./basePieceValidator";

export default class RookValidator extends BasePieceValidator{
    /**
     *
     */
    constructor(piece: IPiece, board: (GameObjects.Sprite | null)[][], moveHistory: IMoveHistory) {

        super(piece, board, moveHistory);
    }
    
    public override validMoves(): IValidMove[]{
        const validMoves: IValidMove[] = [];
        const x = this.piece.x;
        const y = this.piece.y;

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
}
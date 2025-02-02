import { GameObjects } from "phaser";
import BasePieceValidator from "./basePieceValidator";
import { IPiece, IMoveHistory, IBothKingsPosition, IValidMove } from "../utilities/types";

export default class KnightValidator extends BasePieceValidator{
    /**
     *
     */
    constructor(piece: IPiece, board: (GameObjects.Sprite | null)[][], moveHistory: IMoveHistory, bothKingsPosition: IBothKingsPosition) {
        super(piece, board, moveHistory, bothKingsPosition);
    }
    
    public override validMoves(): IValidMove[]{
        let validMoves: IValidMove[] = [];
        const x = this.piece.x;
        const y = this.piece.y;
        
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

        // TODO: ADDITIONAL
        // this will check if this piece is absolutely pinned to its friend king
        validMoves = this.filterLegalMovesWhenPinned(validMoves);
        
        return validMoves;
    }
    
}
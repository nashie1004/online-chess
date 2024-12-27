import { GameObjects } from "phaser";
import { IMoveHistory, IPiece, IValidMove } from "../../utils/types";
import BasePieceValidator from "./basePieceValidator";

export default class KingValidator extends BasePieceValidator{
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
}
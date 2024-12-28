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

        const validKingSideCastling = this.validKingSideCastling();
        if (validKingSideCastling){
            validMoves.push(validKingSideCastling);
        }

        return validMoves;
    }

    validKingSideCastling(): IValidMove | null {
        const nameX = Number(this.piece.uniqueName.split("-")[1]);
        const nameY = Number(this.piece.uniqueName.split("-")[2]);

        // 1. if the king has already moved yet, invalid castling
        if (this.piece.x !== nameX && this.piece.y !== nameY) return null;
        
        // 2. if the king side rook hasnt moved yet
        const rookX = this.piece.x + 3; 
        const rookY = this.piece.y;       

        if (!this.board[rookX][rookY]) return null; // rook is captured or rook has moved from inital position

        // 3. if there are no blockage
        if (this.board[this.piece.x + 2][this.piece.y]) return null; // knight
        if (this.board[this.piece.x + 1][this.piece.y]) return null; // bishop

        return { x: this.piece.x + 2, y: this.piece.y, isCapture: false };
    }
}
import { GameObjects } from "phaser";
import { IMoveHistory, IMoveInfo, IPiece, IValidMove } from "../../utils/types";
import BasePieceValidator from "./basePieceValidator";

export default class PawnValidator extends BasePieceValidator{
    /**
     *
     */
    constructor(piece: IPiece, board: (GameObjects.Sprite | null)[][], moveHistory: IMoveHistory) {

        super(piece, board, moveHistory);
    }
    
    public override validMoves(): IValidMove[]{
        const x = this.piece.x;
        const y = this.piece.y;
        
        const validMoves: IValidMove[] = [];
        const isWhite = this.piece.name.toString()[0] === "w";
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
            const blockage = this.board[col][row]
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
        return validMoves;

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
}
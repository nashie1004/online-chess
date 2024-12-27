import { GameObjects } from "phaser";
import { IMoveHistory, IMoveInfo, IPiece, IValidMove } from "../../utils/types";
import BasePieceValidator from "./basePieceValidator";

export default class PawnValidator extends BasePieceValidator{
    /**
     *
     */
    private readonly isWhite: boolean;
    public readonly captureYDirection: -1 | 1;

    constructor(piece: IPiece, board: (GameObjects.Sprite | null)[][], moveHistory: IMoveHistory) {

        super(piece, board, moveHistory);

        this.isWhite = this.piece.name.toString()[0] === "w";
        this.captureYDirection = this.isWhite ? -1 : 1;
    }
    
    public override validMoves(): IValidMove[]{
        const x = this.piece.x;
        const y = this.piece.y;
        
        const validMoves: IValidMove[] = [];
        
        // 1. normal 1 square forward
        if (y <= 7 || y >= 0){
            const col = x;
            const row = y + (this.captureYDirection * 1);

            // block pawn from moving
            if (!this.board[col][row]) validMoves.push({ x: col, y: row, isCapture: false });

        }

        // 2. one time only 2 squares forward
        if (
            (y <= 7 || y >= 0) &&
            (this.isWhite && y === 6) ||
            (!this.isWhite && y === 1)
        ){
            const col = x;
            const row = y + (this.captureYDirection * 2);

            // block pawn from moving
            const blockageOnfirstSquare = this.board[col][y + this.captureYDirection]
            const blockageOnSecondSquare = this.board[col][row]
            if (!blockageOnSecondSquare && !blockageOnfirstSquare) {
                validMoves.push({ x: col, y: row, isCapture: false });
            }

        }

        // 3. check diagonal capture
        const captureDirection = [
            { x: -1, y: this.captureYDirection } // top left
            ,{ x: 1, y: this.captureYDirection } // top right
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
        const enPassantCapture = this.validEnPassantCapture();
        if (enPassantCapture){
            validMoves.push(enPassantCapture);
        }
      
        return validMoves;
    }

    /**
     * - checks this.piece coordinates and validates against opponent's latest move
     * @returns 
     */
    public validEnPassantCapture(): IValidMove | null{
        // get the opponent's latest move and
        // if both sides already have 1 move
        if (
            this.moveHistory.black.length > 0 && this.moveHistory.white.length > 0  
        ){
            let latestMove: IMoveInfo;
            if (this.isWhite){
                latestMove = this.moveHistory.black[this.moveHistory.black.length - 1].new
            } else {
                latestMove = this.moveHistory.white[this.moveHistory.white.length - 1].new
            }
    
            // if the latest move is a pawn, and the row is 3 (for white) or 5 (for black)
            // allow capture
            if (
                ((latestMove.y === 3 && this.isWhite && this.piece.y === 3) || (latestMove.y === 4 && !this.isWhite && this.piece.y === 4))
                && latestMove.pieceName.toLowerCase().indexOf("pawn")
            ){
                return { x: latestMove.x, y: this.piece.y + this.captureYDirection, isCapture: true };
            }
        }

        return null;
    }
}
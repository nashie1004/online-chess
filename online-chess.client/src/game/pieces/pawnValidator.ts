import { GameObjects } from "phaser";
import { IBothKingsPosition, IMoveHistory, IPiece, IValidMove } from "../utilities/types";
import BasePieceValidator from "./basePieceValidator";

export default class PawnValidator extends BasePieceValidator{
    /**
     *
     */
    private readonly isWhite: boolean;
    public readonly captureYDirection: -1 | 1;
    private readonly showCaptureSquares: boolean; // for invalidating opponent king move to pawn capture squares
    private readonly boardOrientationIsWhite: boolean;

    constructor(piece: IPiece, board: (GameObjects.Sprite | null)[][], moveHistory: IMoveHistory, showCaptureSquares: boolean, bothKingsPosition: IBothKingsPosition, boardOrientationIsWhite: boolean) {

        super(piece, board, moveHistory, bothKingsPosition);

        this.isWhite = this.piece.name.toString()[0] === "w";
        this.boardOrientationIsWhite = boardOrientationIsWhite;
        this.captureYDirection = this.isWhite ? (this.boardOrientationIsWhite ? -1 : 1) : (!this.boardOrientationIsWhite ? -1 : 1);
        this.showCaptureSquares = showCaptureSquares;
    }

    public override validMoves(): IValidMove[]{
        const x = this.piece.x;
        const y = this.piece.y;

        let validMoves: IValidMove[] = [];

        // 1. normal 1 square forward
        if (y <= 7 || y >= 0){
            const col = x;
            const row = y + (this.captureYDirection * 1);

            // block pawn from moving
            if (!this.isOutOfBounds(col, row)) {
                if (!this.board[col][row]) validMoves.push({ x: col, y: row, isCapture: false });
            }

        }

        // 2. one time only 2 squares forward
        if (
            (y <= 7 || y >= 0) &&
            ((this.isWhite && y === 6 && this.boardOrientationIsWhite) || (this.isWhite && y === 1 && !this.boardOrientationIsWhite)) ||
            ((!this.isWhite && y === 1 && this.boardOrientationIsWhite) || (!this.isWhite && y === 6 && !this.boardOrientationIsWhite))
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

                // for invalidating opponent king move to pawn capture squares
                // this is just used for the king validator class
                if (this.showCaptureSquares){
                    validMoves.push({ x: col, y: row, isCapture: true });
                    return;
                }

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

        validMoves = this.filterLegalMovesWhenPinned(validMoves);

        return validMoves;
    }

    /**
     * - checks this.piece coordinates and validates against opponent's latest move
     * @returns
     */
    public validEnPassantCapture(): IValidMove | null{
        let retVal = null;

        if (this.moveHistory.black.length < 1 || this.moveHistory.white.length < 1) return retVal;

        let enemyLatestMove: IPiece;

        if (this.isWhite){
            enemyLatestMove = this.moveHistory.black[this.moveHistory.black.length - 1].new
        } else {
            enemyLatestMove = this.moveHistory.white[this.moveHistory.white.length - 1].new
        }

        if (enemyLatestMove.name.toLowerCase().indexOf("pawn") < 0) return retVal;

        // same rank (y) and just nearby square (x)
        if (
            this.piece.y === enemyLatestMove.y && 
            (this.piece.x - 1 === enemyLatestMove.x || this.piece.x + 1 === enemyLatestMove.x)
            && (this.piece.y === 3 || this.piece.y === 4)
            && (enemyLatestMove.y - 2 === 1 || enemyLatestMove.y + 2 === 6)
        ){
            retVal = { x: enemyLatestMove.x, y: this.piece.y + this.captureYDirection, isCapture: true };
        }
      
        return retVal;
    }

    /**
     * - checks this.piece coordinates and validates against opponent's latest move
     * @returns
    public validEnPassantCaptureOld2(): IValidMove | null{
        let retVal = null;
        return retVal;

        if (this.moveHistory.black.length < 1 || this.moveHistory.white.length < 1) return retVal;

        let enemyLatestMove: IPiece;

        if (this.isWhite){
            enemyLatestMove = this.moveHistory.black[this.moveHistory.black.length - 1].new
        } else {
            enemyLatestMove = this.moveHistory.white[this.moveHistory.white.length - 1].new
        }

        // if the latest move is a pawn, and the row is 3 (for white) or 5 (for black)
        // allow capture
        if (enemyLatestMove.name.toLowerCase().indexOf("pawn") < 0) return retVal;

        let enemyPawnY = enemyLatestMove.y;
        let enemyPawnX = enemyLatestMove.x;
        let thisPawnX = this.piece.x;
        let thisPawnY = this.piece.y;

        if (!this.boardOrientationIsWhite){
            enemyPawnX = Math.abs(7 - enemyLatestMove.x);
            enemyPawnY = Math.abs(7 - enemyLatestMove.y);
            
            thisPawnX = Math.abs(7 - thisPawnX);
            thisPawnY = Math.abs(7 - thisPawnY);
        }

        // console.log({ thisPawnX, thisPawnY }, enemyLatestMove) // TODO 3/3/2025 9:30PM

        if (
            (
                (enemyPawnY === 3 && thisPawnY === 3) ||
                (enemyPawnY === 4 && thisPawnY === 4)
            )
            &&
            (enemyPawnX - 1 === thisPawnX || enemyPawnX + 1 === thisPawnX)
        ){
            retVal = { x: enemyPawnX, y: thisPawnY + this.captureYDirection, isCapture: true };
        }

        return retVal;
    }
     */

    /*
    public validEnPassantCapture_OLD(): IValidMove | null{
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
                (
                    (
                        (latestMove.y === 3 && this.isWhite && this.piece.y === 3 && this.boardOrientationIsWhite) ||
                        (latestMove.y === 4 && this.isWhite && this.piece.y === 4 && !this.boardOrientationIsWhite)
                    )
                    ||
                    (
                        (latestMove.y === 4 && !this.isWhite && this.piece.y === 4 && this.boardOrientationIsWhite) ||
                        (latestMove.y === 3 && !this.isWhite && this.piece.y === 3 && !this.boardOrientationIsWhite)  
                    )
                )
                && latestMove.pieceName.toLowerCase().indexOf("pawn")
            ){
                return { x: latestMove.x, y: this.piece.y + this.captureYDirection, isCapture: true };
            }
        }

        return null;
    }
    */
}
import { GameObjects } from "phaser";
import { IMoveHistory, IPiece, IValidMove } from "../../utils/types";
import BasePieceValidator from "./basePieceValidator";
import QueenValidator from "./queenValidator";
import KnightValidator from "./knightValidator";
import { PieceNames } from "../../utils/constants";
import BishopValidator from "./bishopValidator";
import PawnValidator from "./pawnValidator";
import RookValidator from "./rookValidator";

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

        // castling
        const validKingSideCastling = this.validKingSideCastling(this.piece.x, this.piece.y);
        if (validKingSideCastling){
            validMoves.push(validKingSideCastling);
        }
        const validQueenSideCastling = this.validQueenSideCastling(this.piece.x, this.piece.y);
        if (validQueenSideCastling){
            validMoves.push(validQueenSideCastling);
        }

        return validMoves;
    }

    // used by this class and MainGameScene.ts > this.move()
    validKingSideCastling(x: number, y: number): IValidMove | null {
        // 1. if the king has already moved yet, invalid castling
        const isWhite = this.piece.name[0] === "w";
        const history = isWhite ? this.moveHistory.white : this.moveHistory.black;
        let kingHasMoved = false;

        history.forEach(move => {
            if (move.new.pieceName.toLowerCase().indexOf("king") >= 0){
                kingHasMoved = true;
            }
        });
    
        if (kingHasMoved) return null;
        
        // 2. if the king side rook hasnt moved yet
        const rookX = x + 3; 
        const rookY = y;       

        if (!this.board[rookX][rookY]) return null; // rook is captured or rook has moved from inital position

        // 3. if there are no blockage (knight, bishop)
        const bishopSquare = this.board[x + 1][y];
        const knightSquare = this.board[x + 2][y];
        
        if (knightSquare || bishopSquare){
            // in MainGameScene.ts > this.move() the king has already changed coordinates,
            // this is to handle that case,
            if (this.piece.uniqueName !== (knightSquare?.name ?? "")){
                return null
            }
        }

        return { x: x + 2, y, isCapture: false };
    }
    
    validQueenSideCastling(x: number, y: number): IValidMove | null {
        // 1. if the king has already moved yet, invalid castling
        const isWhite = this.piece.name[0] === "w";
        const history = isWhite ? this.moveHistory.white : this.moveHistory.black;
        let kingHasMoved = false;

        history.forEach(move => {
            if (move.new.pieceName.toLowerCase().indexOf("king") >= 0){
                kingHasMoved = true;
            }
        });
     
        if (kingHasMoved) return null;

        // 2. if the king side rook hasnt moved yet
        const rookX = x - 4; 
        const rookY = y;       

        if (!this.board[rookY][rookX]) return null; // rook is captured or rook has moved from inital position

        // 3. if there are no blockage (knight, bishop)
        const queenSquare = this.board[x - 1][y];
        const bishopSquare = this.board[x - 2][y];
        const knightSquare = this.board[x - 3][y];
        
        if (knightSquare || bishopSquare || queenSquare){
            // in MainGameScene.ts > this.move() the king has already changed coordinates,
            // this is to handle that case,
            if (this.piece.uniqueName !== (bishopSquare?.name ?? "")){
                return null
            }
        }

        return { x: x - 2, y, isCapture: false };
    }

    /**
     * - if the piece coords provided can attack the opposite king 
     * @param enemyX 
     * @param enemyY 
     * @param enemyName 
     * @returns if the king is in check
     */
    validateCheck(enemyX: number, enemyY: number, enemyName: PieceNames){
        const kingIsWhite = this.piece.name[0] === "w";
        let validMoves: IValidMove[] = []
        let pieceName = "pawn";
        let hasACheck = false;

        switch(enemyName){
            case PieceNames.bPawn:
            case PieceNames.wPawn:
                validMoves = (new PawnValidator(this.piece, this.board, this.moveHistory)).validMoves();
                pieceName = "pawn";
                break;
            case PieceNames.bRook:
            case PieceNames.wRook:
                validMoves = (new RookValidator(this.piece, this.board, this.moveHistory)).validMoves();
                pieceName = "rook";
                break;
            case PieceNames.bKnight:
            case PieceNames.wKnight:
                validMoves = (new KnightValidator(this.piece, this.board, this.moveHistory)).validMoves();
                pieceName = "knight";
                break;
            case PieceNames.bBishop:
            case PieceNames.wBishop:
                validMoves = (new BishopValidator(this.piece, this.board, this.moveHistory)).validMoves();
                pieceName = "bishop";
                break;
            case PieceNames.bQueen:
            case PieceNames.wQueen:
                validMoves = (new QueenValidator(this.piece, this.board, this.moveHistory)).validMoves();
                pieceName = "queen";
                break;
        }

        validMoves.forEach(move => {
            const currTile = this.board[move.x][move.y];
            if (!currTile) return;

            // tile is not empty and has an enemny piece in it
            if (move.x === enemyX && move.y === enemyY){
                const enemyPieceIsWhite = currTile.name[0] === "w";
                
                if ((!kingIsWhite && enemyPieceIsWhite) || (kingIsWhite && !enemyPieceIsWhite)){
                    hasACheck = true;
                    console.info(`${pieceName} check: `, currTile.name, move)
                }
            }
        });
        
        if (hasACheck) return true;

        return hasACheck;
    }

    validateCheckMate(){
        //
    }
}
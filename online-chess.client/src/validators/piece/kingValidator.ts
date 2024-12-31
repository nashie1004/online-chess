import { GameObjects } from "phaser";
import { IBaseCoordinates, IMoveHistory, IPiece, IValidMove } from "../../utils/types";
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
    private readonly isInCheck: boolean;

    constructor(piece: IPiece, board: (GameObjects.Sprite | null)[][], moveHistory: IMoveHistory, isInCheck: boolean) {

        super(piece, board, moveHistory);
        this.isInCheck = isInCheck;
    }
    
    public override validMoves(): IValidMove[]{
        let validMoves: IValidMove[] = [];
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
        if (!this.isInCheck){
            const validKingSideCastling = this.validKingSideCastling(this.piece.x, this.piece.y);
            if (validKingSideCastling){
                validMoves.push(validKingSideCastling);
            }
            const validQueenSideCastling = this.validQueenSideCastling(this.piece.x, this.piece.y);
            if (validQueenSideCastling){
                validMoves.push(validQueenSideCastling);
            }
        }

        // check for danger squares
        // get all king initial 8 valid moves, foreach initial move
        // run queen and knight validator, then check if any square has an overlap
        const kingIsWhite = this.piece.name[0] === "w";
        const dangerSquaresSet = new Set<string>();  // Use a Set for faster lookups

        const _this = this;
        validMoves.forEach(initialValidMove => {

            // for each of the king valid squares (assuming 8) simulate all rook, knight, bishop moves

            // 1. rook
            const rookSquares = (new RookValidator(
                { x: initialValidMove.x, y: initialValidMove.y, name: (kingIsWhite ? PieceNames.wRook : PieceNames.bRook) }
                , _this.board, _this.moveHistory)).validMoves();

            rookSquares.forEach(square => {
                const currTile = _this.board[square.x][square.y];
                if (!currTile) return;
                const currTileIsWhite = currTile.name[0] === "w";

                if (
                    currTile.name.toLowerCase().indexOf("rook") >= 0 || 
                    currTile.name.toLowerCase().indexOf("queen") >= 0  
                    && ((kingIsWhite && !currTileIsWhite) || !kingIsWhite && currTileIsWhite) 
                ){
                    dangerSquaresSet.add(`${initialValidMove.x}-${initialValidMove.y}`);
                }
            });
            
            // 2. bishop
            const bishopSquares = (new BishopValidator(
                { x: initialValidMove.x, y: initialValidMove.y, name: (kingIsWhite ? PieceNames.wRook : PieceNames.bRook) }
                , _this.board, _this.moveHistory)).validMoves();

            bishopSquares.forEach(square => {
                const currTile = _this.board[square.x][square.y];
                if (!currTile) return;
                const currTileIsWhite = currTile.name[0] === "w";

                if (
                    currTile.name.toLowerCase().indexOf("bishop") >= 0 || 
                    currTile.name.toLowerCase().indexOf("queen") >= 0  
                    && ((kingIsWhite && !currTileIsWhite) || !kingIsWhite && currTileIsWhite) 
                ){
                    dangerSquaresSet.add(`${initialValidMove.x}-${initialValidMove.y}`);
                }
            });
            
            // 3. knight
            const knightSquares = (new KnightValidator(
                { x: initialValidMove.x, y: initialValidMove.y, name: (kingIsWhite ? PieceNames.wRook : PieceNames.bRook) }
                , _this.board, _this.moveHistory)).validMoves();

            knightSquares.forEach(square => {
                const currTile = _this.board[square.x][square.y];
                if (!currTile) return;
                const currTileIsWhite = currTile.name[0] === "w";

                if (
                    currTile.name.toLowerCase().indexOf("knight") >= 0  
                    && ((kingIsWhite && !currTileIsWhite) || !kingIsWhite && currTileIsWhite) 
                ){
                    dangerSquaresSet.add(`${initialValidMove.x}-${initialValidMove.y}`);
                }
            });
            
            // 4. pawn
            const pawnSquares = (new PawnValidator(
                { x: initialValidMove.x, y: initialValidMove.y, name: (kingIsWhite ? PieceNames.wPawn : PieceNames.bPawn) }
                , _this.board, _this.moveHistory, true)).validMoves();

            pawnSquares.forEach(square => {
                const currTile = _this.board[square.x][square.y];
                if (!currTile) return;
                const currTileIsWhite = currTile.name[0] === "w";

                if (
                    currTile.name.toLowerCase().indexOf("pawn") >= 0  
                    && ((kingIsWhite && !currTileIsWhite) || !kingIsWhite && currTileIsWhite) 
                ){
                    dangerSquaresSet.add(`${initialValidMove.x}-${initialValidMove.y}`);
                }
            });

        });
        
        validMoves = validMoves.filter(j => {
            // if their is an overlap, remove that as valid king move
            return !dangerSquaresSet.has(`${j.x}-${j.y}`);
        });

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

        // 4. check if the king doesnt pass through a square under attack
        // sqaure beside king, generate all possible moves in that new king position,  
        const isUnderAttack ={ x: x + 1, y, isCapture: false };
        const _this = this;
        let rookSquareIsUnderAttack = false;

        // 4.1. enemy rook and queen attacks that castling tile
        const rookMoves = (new RookValidator({
            x: isUnderAttack.x, y: isUnderAttack.y, name: isWhite ? PieceNames.wRook : PieceNames.bRook 
        }, this.board, this.moveHistory)).validMoves();
        
        rookMoves.forEach(rookMove => {
            const currTile = _this.board[rookMove.x][rookMove.y];
            if (!currTile) return;

            if (
                (currTile.name[0] === "w" && !isWhite) ||
                (currTile.name[0] === "b" && isWhite) &&
                (
                    currTile.name.toLowerCase().indexOf("queen") >= 0 || 
                    currTile.name.toLowerCase().indexOf("rook") >= 0 
                )
            ){
                rookSquareIsUnderAttack = true;
            } 
        });
        
        // 4.2. enemy bishop and queen attacks that castling tile
        const bishopMoves = (new BishopValidator({
            x: isUnderAttack.x, y: isUnderAttack.y, name: isWhite ? PieceNames.wRook : PieceNames.bRook 
        }, this.board, this.moveHistory)).validMoves();
        
        bishopMoves.forEach(bishopMove => {
            const currTile = _this.board[bishopMove.x][bishopMove.y];
            if (!currTile) return;

            if (
                (currTile.name[0] === "w" && !isWhite) ||
                (currTile.name[0] === "b" && isWhite) &&
                (
                    currTile.name.toLowerCase().indexOf("queen") >= 0 || 
                    currTile.name.toLowerCase().indexOf("bishop") >= 0 
                )
            ){
                rookSquareIsUnderAttack = true;
            } 
        });
        
        // 4.3. enemy knight attacks that castling tile
        const knightMoves = (new KnightValidator({
            x: isUnderAttack.x, y: isUnderAttack.y, name: isWhite ? PieceNames.wRook : PieceNames.bRook 
        }, this.board, this.moveHistory)).validMoves();
        
        knightMoves.forEach(knightMove => {
            const currTile = _this.board[knightMove.x][knightMove.y];
            if (!currTile) return;

            if (
                (currTile.name[0] === "w" && !isWhite) ||
                (currTile.name[0] === "b" && isWhite) &&
                (
                    currTile.name.toLowerCase().indexOf("knight") >= 0 
                )
            ){
                rookSquareIsUnderAttack = true;
            } 
        });
        
        if (rookSquareIsUnderAttack) return null;

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
        
        // 4. check if the king doesnt pass through a square under attack
        // sqaure beside king, generate all possible moves in that new king position,  
        const isUnderAttack ={ x: x - 1, y, isCapture: false };
        const _this = this;
        let rookSquareIsUnderAttack = false;

        // 4.1. enemy rook and queen attacks that castling tile
        const rookMoves = (new RookValidator({
            x: isUnderAttack.x, y: isUnderAttack.y, name: isWhite ? PieceNames.wRook : PieceNames.bRook 
        }, this.board, this.moveHistory)).validMoves();
        
        rookMoves.forEach(rookMove => {
            const currTile = _this.board[rookMove.x][rookMove.y];
            if (!currTile) return;

            if (
                (currTile.name[0] === "w" && !isWhite) ||
                (currTile.name[0] === "b" && isWhite) &&
                (
                    currTile.name.toLowerCase().indexOf("queen") >= 0 || 
                    currTile.name.toLowerCase().indexOf("rook") >= 0 
                )
            ){
                rookSquareIsUnderAttack = true;
            } 
        });
        
        // 4.2. enemy bishop and queen attacks that castling tile
        const bishopMoves = (new BishopValidator({
            x: isUnderAttack.x, y: isUnderAttack.y, name: isWhite ? PieceNames.wRook : PieceNames.bRook 
        }, this.board, this.moveHistory)).validMoves();
        
        bishopMoves.forEach(bishopMove => {
            const currTile = _this.board[bishopMove.x][bishopMove.y];
            if (!currTile) return;

            if (
                (currTile.name[0] === "w" && !isWhite) ||
                (currTile.name[0] === "b" && isWhite) &&
                (
                    currTile.name.toLowerCase().indexOf("queen") >= 0 || 
                    currTile.name.toLowerCase().indexOf("bishop") >= 0 
                )
            ){
                rookSquareIsUnderAttack = true;
            } 
        });
        
        // 4.3. enemy knight attacks that castling tile
        const knightMoves = (new KnightValidator({
            x: isUnderAttack.x, y: isUnderAttack.y, name: isWhite ? PieceNames.wRook : PieceNames.bRook 
        }, this.board, this.moveHistory)).validMoves();
        
        knightMoves.forEach(knightMove => {
            const currTile = _this.board[knightMove.x][knightMove.y];
            if (!currTile) return;

            if (
                (currTile.name[0] === "w" && !isWhite) ||
                (currTile.name[0] === "b" && isWhite) &&
                (
                    currTile.name.toLowerCase().indexOf("knight") >= 0 
                )
            ){
                rookSquareIsUnderAttack = true;
            } 
        });
        
        if (rookSquareIsUnderAttack) return null;

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
        let hasACheck = false;
        const validMoves: IValidMove[] = this.switchPieceValidMoves(this.piece, enemyName);

        validMoves.forEach(move => {
            const currTile = this.board[move.x][move.y];
            if (!currTile) return;

            // tile is not empty and has an enemny piece in it
            if (move.x === enemyX && move.y === enemyY){
                const enemyPieceIsWhite = currTile.name[0] === "w";
                
                if ((!kingIsWhite && enemyPieceIsWhite) || (kingIsWhite && !enemyPieceIsWhite)){
                    hasACheck = true;
                    // console.info(`${pieceName} check: `, currTile.name, move)
                }
            }
        });
        
        if (hasACheck) return true;

        return hasACheck;
    }

    private switchPieceValidMoves(piece: IPiece, enemyName: PieceNames){
        switch(enemyName){
            case PieceNames.bPawn:
            case PieceNames.wPawn:
                return (new PawnValidator(piece, this.board, this.moveHistory, false)).validMoves();
            case PieceNames.bRook:
            case PieceNames.wRook:
                return (new RookValidator(piece, this.board, this.moveHistory)).validMoves();
            case PieceNames.bKnight:
            case PieceNames.wKnight:
                return (new KnightValidator(piece, this.board, this.moveHistory)).validMoves();
            case PieceNames.bBishop:
            case PieceNames.wBishop:
                return (new BishopValidator(piece, this.board, this.moveHistory)).validMoves();
            case PieceNames.bQueen:
            case PieceNames.wQueen:
                return (new QueenValidator(piece, this.board, this.moveHistory)).validMoves();
            default:  
                return [];
        }
    }

    
    /**
     * - get bishop's line of attack
     * @param pieceA - the king
     * @param pieceB - the bishop
     */
    public traceDiagonalPath(enemyBishop: IBaseCoordinates){
        const attackerSquares: IBaseCoordinates[] = [];
        const xDiff = enemyBishop.x - this.piece.x;
        const yDiff = enemyBishop.y - this.piece.y;

        // check if both this class king and enemy bishop are in the same diagonal
        if (Math.abs(xDiff) === Math.abs(yDiff)){
            const xMove = xDiff < 0 ? -1 : 1;
            const yMove = yDiff < 0 ? -1 : 1;

            let currentCol = this.piece.x;
            let currentRow = this.piece.y;

            // trace the path from king square to enemy bishop square
            while(currentCol !== enemyBishop.x && currentRow !== enemyBishop.y){
                currentCol += xMove;
                currentRow += yMove;

                attackerSquares.push({ x: currentCol, y: currentRow });
            }
        }

        return attackerSquares;
    }
    
    /**
     * - get rooks's line of attack
     * @param pieceA - the king
     * @param pieceB - the bishop
     */
    public traceStraightPath(enemyRook: IBaseCoordinates){
        const attackerSquares: IBaseCoordinates[] = [];

        const xDiff = enemyRook.x - this.piece.x;
        const yDiff = enemyRook.y - this.piece.y;

        // check if both this class king and enemy rook are in the same row or col
        if (
            (this.piece.x === enemyRook.x) ||
            (this.piece.y === enemyRook.y)
        ){

            const xMove = (this.piece.x === enemyRook.x) ? 0 : (xDiff < 0 ? -1 : 1);
            const yMove = (this.piece.y === enemyRook.y) ? 0 : (yDiff < 0 ? -1 : 1);

            let currentCol = this.piece.x;
            let currentRow = this.piece.y;

            // trace the path from king square to enemy rook square
            while(currentCol !== enemyRook.x || currentRow !== enemyRook.y){
                currentCol += xMove;
                currentRow += yMove;

                attackerSquares.push({ x: currentCol, y: currentRow });
            }
        }

        return attackerSquares;
    }

}
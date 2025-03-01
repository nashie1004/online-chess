import { GameObjects } from "phaser";
import { IKingState, IMoveHistory, IPiece, IValidMove } from "../utilities/types";
import BasePieceValidator from "./basePieceValidator";

export default class RookValidator extends BasePieceValidator{
    /**
     *
     */
    private readonly allowXRayOpponentKing: boolean;

    constructor(piece: IPiece, board: (GameObjects.Sprite | null)[][], moveHistory: IMoveHistory, allowXRayOpponentKing: boolean = false, bothKingsState: IKingState) {

        super(piece, board, moveHistory, bothKingsState);
        
        this.allowXRayOpponentKing = allowXRayOpponentKing;
    }
    
    public override validMoves(): IValidMove[]{
        let validMoves: IValidMove[] = [];
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

                        // normal rook move
                        if (!this.allowXRayOpponentKing){
                            validMoves.push({ x: col, y: row, isCapture: true })
                            break;
                        }
                        
                        // these lines are for invalidating squares behind a king
                        // in check
                        if (currTile.name.toLowerCase().indexOf("king") >= 0){
                            continue;
                        }

                    }
                }
    
                validMoves.push({ x: col, y: row, isCapture: false })
            }
        })

        validMoves = this.filterLegalMovesWhenPinned(validMoves);

        return validMoves;
    }
}
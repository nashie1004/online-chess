import { GameObjects } from "phaser";
import BasePieceValidator from "./basePieceValidator";
import { IPiece, IMoveHistory, IValidMove, IKingState } from "../utilities/types";

export default class BishopValidator extends BasePieceValidator{
    /**
     *
     */
    private readonly allowXRayOpponentKing: boolean;

    constructor(piece: IPiece, board: (GameObjects.Sprite | null)[][], moveHistory: IMoveHistory, allowXRayOpponentKing: boolean = false, bothKingsState: IKingState) {

        super(piece, board, moveHistory, bothKingsState);

        this.allowXRayOpponentKing = allowXRayOpponentKing;
    }
    
    public override validMoves(): IValidMove[]{
        const x = this.piece.x;
        const y = this.piece.y;

        let validMoves: IValidMove[] = [];

        const directions = [
            { x: -1, y: -1 } // Top Left: -x, -y
            ,{ x: -1, y: 1 } // Bottom Left: -x, +y
            ,{ x: 1, y: -1 } // Top Right: +x, -y
            ,{ x: 1, y: 1 } // Bottom Right: +x, +y
        ]

        directions.forEach(direction => {
            let row = 0;
            let col = 0;
    
            row = y;
            col = x;
            while (row >= 0 && col >= 0 && row <= 7 && col <= 7){
                row += direction.y;
                col += direction.x;

                // still within the board
                if (this.isOutOfBounds(col, row)) continue;

                const currTile = this.board[col][row]

                if (
                    (col !== x && row !== y) // Not the actual square
                    &&
                    currTile // Square is occupied
                ){
                    if (this.isAFriendPiece(currTile.name)){ // a friend
                        break;
                    } 
                    else{

                        // normal bishop capture
                        if (!this.allowXRayOpponentKing){
                            validMoves.push({ x: col, y: row, isCapture: true }) // an opponent
                            break;
                        }

                        // these lines are for invalidating squares behind a king
                        // in check
                        if (currTile.name.toLowerCase().indexOf("king") >= 0){
                            continue;
                        }
                    
                    }
                }
                
                validMoves.push({ x: col, y: row, isCapture: false})
            }
        })

        validMoves = this.filterLegalMovesWhenPinned(validMoves);

        return validMoves;
    }
    
}
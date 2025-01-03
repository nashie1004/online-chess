import { GameObjects } from "phaser";
import { IBothKingsPosition, IMoveHistory, IPiece, IValidMove } from "../../utilities/types";
import BasePieceValidator from "./basePieceValidator";
import RookValidator from "./rookValidator";
import BishopValidator from "./bishopValidator";

export default class QueenValidator extends BasePieceValidator{
    /**
     *
     */
    private readonly allowXRayOpponentKing: boolean;

    constructor(piece: IPiece, board: (GameObjects.Sprite | null)[][], moveHistory: IMoveHistory, allowXRayOpponentKing: boolean = false, bothKingsPosition: IBothKingsPosition) {

        super(piece, board, moveHistory, bothKingsPosition);

        this.allowXRayOpponentKing = allowXRayOpponentKing;
    }
    
    public override validMoves(): IValidMove[]{
        let validMoves: IValidMove[] = [];

        const rookValidator = new RookValidator(this.piece, this.board, this.moveHistory, this.allowXRayOpponentKing, this.bothKingsPosition);
        const bishopValidator = new BishopValidator(this.piece, this.board, this.moveHistory, this.allowXRayOpponentKing, this.bothKingsPosition);
        
        validMoves = [...rookValidator.validMoves(), ...bishopValidator.validMoves()]

        // this will check if this piece is absolutely pinned to its friend king
        const absolutePinFilter = this.validateAbsolutelyPinned();

        if (absolutePinFilter.isPinned) {

            validMoves = validMoves.filter(initialValidMove => {

                // 1. enemy rook or queen 
                if (absolutePinFilter.restrictedToCol && initialValidMove.x === absolutePinFilter.restrictedToCol) {
                    return initialValidMove;
                }
                else if (absolutePinFilter.restrictedToRow && initialValidMove.y === absolutePinFilter.restrictedToRow) {
                    return initialValidMove;
                }

                // 2. enemy bishop or queen

                // bottom left to top right = x: +1, y: -1 

                // top left to bottom right = x: +1, y: +1

            });

        }

        return validMoves;
    }
}
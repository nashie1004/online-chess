import { GameObjects } from "phaser";
import { IMoveHistory, IPiece, IValidMove } from "../../utils/types";
import BasePieceValidator from "./basePieceValidator";
import RookValidator from "./rookValidator";
import BishopValidator from "./bishopValidator";

export default class QueenValidator extends BasePieceValidator{
    /**
     *
     */
    private readonly allowXRayOpponentKing: boolean;

    constructor(piece: IPiece, board: (GameObjects.Sprite | null)[][], moveHistory: IMoveHistory, allowXRayOpponentKing?: boolean) {

        super(piece, board, moveHistory);

        this.allowXRayOpponentKing = allowXRayOpponentKing ?? false;
    }
    
    public override validMoves(): IValidMove[]{
        let validMoves: IValidMove[] = [];

        const rookValidator = new RookValidator(this.piece, this.board, this.moveHistory, this.allowXRayOpponentKing);
        const bishopValidator = new BishopValidator(this.piece, this.board, this.moveHistory, this.allowXRayOpponentKing);
        
        validMoves = [...rookValidator.validMoves(), ...bishopValidator.validMoves()]

        return validMoves;
    }
}
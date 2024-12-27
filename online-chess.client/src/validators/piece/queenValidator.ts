import { GameObjects } from "phaser";
import { IMoveHistory, IPiece, IValidMove } from "../../utils/types";
import BasePieceValidator from "./basePieceValidator";
import RookValidator from "./rookValidator";
import BishopValidator from "./bishopValidator";

export default class QueenValidator extends BasePieceValidator{
    /**
     *
     */
    constructor(piece: IPiece, board: (GameObjects.Sprite | null)[][], moveHistory: IMoveHistory) {

        super(piece, board, moveHistory);
    }
    
    public override validMoves(): IValidMove[]{
        let validMoves: IValidMove[] = [];

        const rookValidator = new RookValidator(this.piece, this.board, this.moveHistory);
        const bishopValidator = new BishopValidator(this.piece, this.board, this.moveHistory);
        
        validMoves = [...rookValidator.validMoves(), ...bishopValidator.validMoves()]

        return validMoves;
    }
}
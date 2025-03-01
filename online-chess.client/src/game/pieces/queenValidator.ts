import { GameObjects } from "phaser";
import { IKingState, IMoveHistory, IPiece, IValidMove } from "../utilities/types";
import BasePieceValidator from "./basePieceValidator";
import RookValidator from "./rookValidator";
import BishopValidator from "./bishopValidator";

export default class QueenValidator extends BasePieceValidator{
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

        const rookValidator = new RookValidator(this.piece, this.board, this.moveHistory, this.allowXRayOpponentKing, this.bothKingsState);
        const bishopValidator = new BishopValidator(this.piece, this.board, this.moveHistory, this.allowXRayOpponentKing, this.bothKingsState);
        
        validMoves = [...rookValidator.validMoves(), ...bishopValidator.validMoves()]

        validMoves = this.filterLegalMovesWhenPinned(validMoves);

        return validMoves;
    }
}
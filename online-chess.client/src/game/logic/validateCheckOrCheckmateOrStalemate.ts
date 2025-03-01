import { GameObjects } from "phaser";
import { eventEmitter } from "../utilities/eventEmitter";
import { IPiecesCoordinates, IMoveHistory, IKingState } from "../utilities/types";
import IsCheck from "./isCheck";
import IsCheckMate from "./isCheckMate";
import IsStalemate from "./IsStaleMate";
import { EVENT_EMIT } from "../../constants/emitters";

export default class ValidateCheckOrCheckMateOrStalemate {
    
    private readonly board: (null | GameObjects.Sprite)[][]
    private readonly boardOrientationIsWhite: boolean;
    private readonly pieceCoordinates: IPiecesCoordinates;
    private readonly bothKingsState: IKingState;
    private readonly moveHistory: IMoveHistory;
    
    constructor(
        board: (null | GameObjects.Sprite)[][],
        boardOrientationIsWhite: boolean,
        pieceCoordinates: IPiecesCoordinates,
        bothKingsState: IKingState,
        moveHistory: IMoveHistory,
    ) {
        this.board = board;   
        this.boardOrientationIsWhite = boardOrientationIsWhite;   
        this.pieceCoordinates = pieceCoordinates;   
        this.bothKingsState = bothKingsState;   
        this.moveHistory = moveHistory;
    }

    /**
     *
     * @param sprite
     * @param isWhite
     * @param newX
     * @param newY
     * @returns 0 = no check or checkmate, 1 = check, 2 = checkmate, 3 = stalemate
     */
    validate(isWhite: boolean) : 0 | 1 | 2 {
        // reset all check or checkmate properties
        this.bothKingsState.black.checkedBy = [];
        this.bothKingsState.white.checkedBy = [];
        this.bothKingsState.white.isInCheck = false;
        this.bothKingsState.black.isInCheck = false;
        this.bothKingsState.white.isCheckMate = false;
        this.bothKingsState.black.isCheckMate = false;
        this.bothKingsState.white.isInStalemate = false;
        this.bothKingsState.black.isInStalemate = false;

        // 1. check
        const isCheck = (new IsCheck(
            this.board, this.boardOrientationIsWhite
            ,this.moveHistory, this.bothKingsState
        )).validateCheck(isWhite);

        // 2. stalemate
        if (!isCheck){
            let isStalemate = (new IsStalemate(
                this.board, this.boardOrientationIsWhite
                ,this.pieceCoordinates, this.moveHistory
                ,this.bothKingsState
            )).isStalemate(!isWhite);

            if (isStalemate){
                this.bothKingsState[isWhite ? "black" : "white"].isInStalemate = true;
                return 0;
            }

            return 0;
        }

        // 3. checkmate 
        let isCheckMate = (new IsCheckMate(
            this.board, this.boardOrientationIsWhite
            ,this.pieceCoordinates, this.moveHistory
            ,this.bothKingsState
        )).isCheckmate();

        if (isCheckMate){
            if (this.bothKingsState.white.isInCheck){
                this.bothKingsState.white.isCheckMate = true;
            } else {
                this.bothKingsState.black.isCheckMate = true;
            }
        }

        eventEmitter.emit(EVENT_EMIT.SET_KINGS_STATE, this.bothKingsState);
        return (isCheckMate ? 2 : 1);
    }

}
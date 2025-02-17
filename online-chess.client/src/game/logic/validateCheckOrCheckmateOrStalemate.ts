import { GameObjects } from "phaser";
import { eventEmitter } from "../utilities/eventEmitter";
import { IPiecesCoordinates, IBothKingsPosition, IMoveHistory, IKingState } from "../utilities/types";
import IsCheck from "./isCheck";
import IsCheckMate from "./isCheckMate";
import IsStalemate from "./IsStaleMate";
import { EVENT_EMIT } from "../../constants/emitters";

export default class ValidateCheckOrCheckMateOrStalemate {
    
    private readonly board: (null | GameObjects.Sprite)[][]
    private readonly boardOrientationIsWhite: boolean;
    private readonly pieceCoordinates: IPiecesCoordinates;
    private readonly bothKingsPosition: IBothKingsPosition;
    private readonly moveHistory: IMoveHistory;
    private readonly kingsState: IKingState;
    
    constructor(
        board: (null | GameObjects.Sprite)[][],
        boardOrientationIsWhite: boolean,
        pieceCoordinates: IPiecesCoordinates,
        bothKingsPosition: IBothKingsPosition,
        moveHistory: IMoveHistory,
        kingsState: IKingState
    ) {
        this.board = board;   
        this.boardOrientationIsWhite = boardOrientationIsWhite;   
        this.pieceCoordinates = pieceCoordinates;   
        this.bothKingsPosition = bothKingsPosition;   
        this.moveHistory = moveHistory;
        this.kingsState = kingsState;
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
        this.kingsState.black.checkedBy = [];
        this.kingsState.white.checkedBy = [];
        this.kingsState.white.isInCheck = false;
        this.kingsState.black.isInCheck = false;
        this.kingsState.white.isCheckMate = false;
        this.kingsState.black.isCheckMate = false;
        this.kingsState.white.isInStalemate = false;
        this.kingsState.black.isInStalemate = false;

        //console.log("Start Validate Kings: ", JSON.stringify(this.bothKingsPosition))

        // 1. check
        const isCheck = (new IsCheck(
            this.board 
            ,this.bothKingsPosition, this.boardOrientationIsWhite
            ,this.moveHistory, this.kingsState
        )).validateCheck(isWhite);

        // 2. stalemate
        if (!isCheck){
            let isStalemate = (new IsStalemate(
                this.board, this.boardOrientationIsWhite
                ,this.pieceCoordinates 
                ,this.bothKingsPosition, this.moveHistory
                ,this.kingsState
            )).isStalemate(!isWhite);

            if (isStalemate){
                this.kingsState[isWhite ? "black" : "white"].isInStalemate = true;
                return 0;
            }

            return 0;
        }

        // 3. checkmate 
        let isCheckMate = (new IsCheckMate(
            this.board
            ,this.bothKingsPosition, this.boardOrientationIsWhite
            ,this.pieceCoordinates, this.moveHistory
            ,this.kingsState
        )).isCheckmate();

        if (isCheckMate){
            if (this.kingsState.white.isInCheck){
                this.kingsState.white.isCheckMate = true;
            } else {
                this.kingsState.black.isCheckMate = true;
            }
        }

        //console.log("End Validate Kings: ", JSON.stringify(this.bothKingsPosition))

        eventEmitter.emit(EVENT_EMIT.SET_KINGS_STATE, this.kingsState);
        return (isCheckMate ? 2 : 1);
    }

}
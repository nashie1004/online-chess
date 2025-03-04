import { GameObjects } from "phaser";
import { IPiecesCoordinates, IBothKingsPosition, IMoveHistory, IKingState } from "../utilities/types";
import IsCheck from "./isCheck";
import IsCheckMate from "./isCheckMate";
import IsStalemate from "./IsStaleMate";

export default class ValidateCheckOrCheckMateOrStalemate {
    
    private readonly board: (null | GameObjects.Sprite)[][]
    private readonly boardOrientationIsWhite: boolean;
    private readonly pieceCoordinates: IPiecesCoordinates;
    private readonly bothKingsPosition: IBothKingsPosition;
    private readonly moveHistory: IMoveHistory;
    private readonly bothKingsState: IKingState;
    
    constructor(
        board: (null | GameObjects.Sprite)[][],
        boardOrientationIsWhite: boolean,
        pieceCoordinates: IPiecesCoordinates,
        bothKingsPosition: IBothKingsPosition,
        moveHistory: IMoveHistory,
        bothKingsState: IKingState
    ) {
        this.board = board;   
        this.boardOrientationIsWhite = boardOrientationIsWhite;   
        this.pieceCoordinates = pieceCoordinates;   
        this.bothKingsPosition = bothKingsPosition;   
        this.moveHistory = moveHistory;
        this.bothKingsState = bothKingsState;
    }

    validate(isWhite: boolean) : IKingState {
        this.bothKingsState.white.isInCheck = false;
        this.bothKingsState.white.checkedBy = [];
        this.bothKingsState.white.isCheckMate = false;
        this.bothKingsState.white.isInStalemate = false;
        
        this.bothKingsState.black.isInCheck = false;
        this.bothKingsState.black.checkedBy = [];
        this.bothKingsState.black.isCheckMate = false;
        this.bothKingsState.black.isInStalemate = false;
        
        // 1. check
        const isCheck = (new IsCheck(
            this.board 
            ,this.bothKingsPosition, this.boardOrientationIsWhite
            ,this.moveHistory, this.bothKingsState
        )).validateCheck(isWhite);

        // 2. stalemate
        if (!isCheck){
            let isStalemate = (new IsStalemate(
                this.board, this.boardOrientationIsWhite
                ,this.pieceCoordinates 
                ,this.bothKingsPosition, this.moveHistory
                ,this.bothKingsState
            )).isStalemate(!isWhite);

            if (isStalemate){
                this.bothKingsState[isWhite ? "black" : "white"].isInStalemate = true;
            }

            return this.bothKingsState;
        }

        // 3. checkmate 
        let isCheckMate = (new IsCheckMate(
            this.board
            ,this.bothKingsPosition, this.boardOrientationIsWhite
            ,this.pieceCoordinates, this.moveHistory
            ,this.bothKingsState
        )).isCheckmate();

        if (isCheckMate){
            this.bothKingsState[isWhite ? "white" : "black"].isCheckMate = true;
        }

        return this.bothKingsState;
    }

}
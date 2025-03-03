import { GameObjects } from "phaser";
import { IPiecesCoordinates, IBothKingsPosition, IMoveHistory, IKingState } from "../utilities/types";
import IsCheck from "./isCheck";
import IsCheckMate from "./isCheckMate";
import IsStalemate from "./IsStaleMate";
import { baseKing } from "../utilities/constants";

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

    validate(isWhite: boolean) : IKingState {
        const newKingsState: IKingState = { white: baseKing, black: baseKing };

        // 1. check
        const isCheck = (new IsCheck(
            this.board 
            ,this.bothKingsPosition, this.boardOrientationIsWhite
            ,this.moveHistory, newKingsState
        )).validateCheck(isWhite);

        // 2. stalemate
        if (!isCheck){
            let isStalemate = (new IsStalemate(
                this.board, this.boardOrientationIsWhite
                ,this.pieceCoordinates 
                ,this.bothKingsPosition, this.moveHistory
                ,newKingsState
            )).isStalemate(!isWhite);

            if (isStalemate){
                newKingsState[isWhite ? "black" : "white"].isInStalemate = true;
                return newKingsState;
            }

            return newKingsState;
        }

        // 3. checkmate 
        let isCheckMate = (new IsCheckMate(
            this.board
            ,this.bothKingsPosition, this.boardOrientationIsWhite
            ,this.pieceCoordinates, this.moveHistory
            ,newKingsState
        )).isCheckmate();

        if (isCheckMate){
            newKingsState[isWhite ? "white" : "black"].isCheckMate = true;
        }

        // return (isCheckMate ? 2 : 1);
        
        return newKingsState;
    }

}
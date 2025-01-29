import { GameObjects } from "phaser";
import { eventEmitter } from "../utilities/eventEmitter";
import { IPiecesCoordinates, IPhaserContextValues, IBothKingsPosition, IMoveHistory, IKingState } from "../utilities/types";
import IsCheck from "./isCheck";
import IsCheckMate from "./isCheckMate";
import IsStalemate from "./IsStaleMate";

export default class ValidateCheckOrCheckMateOrStalemate {
    
    private readonly board: (null | GameObjects.Sprite)[][]
    private readonly boardOrientationIsWhite: boolean;
    private readonly pieceCoordinates: IPiecesCoordinates;
    private readonly reactState: IPhaserContextValues;
    private readonly bothKingsPosition: IBothKingsPosition;
    private readonly moveHistory: IMoveHistory;
    private readonly kingsState: IKingState;
    
    constructor(
        board: (null | GameObjects.Sprite)[][],
        boardOrientationIsWhite: boolean,
        pieceCoordinates: IPiecesCoordinates,
        reactState: IPhaserContextValues,
        bothKingsPosition: IBothKingsPosition,
        moveHistory: IMoveHistory,
        kingsState: IKingState
    ) {
        this.board = board;   
        this.boardOrientationIsWhite = boardOrientationIsWhite;   
        this.pieceCoordinates = pieceCoordinates;   
        this.reactState = reactState;   
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
        this.board[this.bothKingsPosition.black.x][this.bothKingsPosition.black.y]?.resetPostPipeline();
        this.board[this.bothKingsPosition.white.x][this.bothKingsPosition.white.y]?.resetPostPipeline();

        // reset all check or checkmate properties
        this.kingsState.black.checkedBy = [];
        this.kingsState.white.checkedBy = [];
        this.kingsState.white.isInCheck = false;
        this.kingsState.black.isInCheck = false;
        this.kingsState.white.isCheckMate = false;
        this.kingsState.black.isCheckMate = false;
        this.kingsState.white.isInStalemate = false;
        this.kingsState.black.isInStalemate = false;

        // check
        const isCheck = (new IsCheck(
            this.board, this.reactState
            ,this.bothKingsPosition, this.boardOrientationIsWhite
            ,this.moveHistory, this.kingsState
        )).validateCheck(isWhite);

        // 1. stalemate
        if (!isCheck){
            let isStalemate = (new IsStalemate(
                this.board, this.boardOrientationIsWhite
                ,this.pieceCoordinates, this.reactState
                ,this.bothKingsPosition, this.moveHistory
            )).isStalemate(!isWhite);

            if (isStalemate){
                this.kingsState[isWhite ? "black" : "white"].isInStalemate = true;
                return 0;
            }

            return 0;
        }

        // 2. check
        const king = isWhite ? this.bothKingsPosition.black : this.bothKingsPosition.white;
        const kingSprite = this.board[king.x][king.y];
        kingSprite?.postFX?.addGlow(0xE44C6A, 10, 2);

        // 3. checkmate 
        let isCheckMate = (new IsCheckMate(
            this.board, this.reactState
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

        eventEmitter.emit("setKingsState", this.kingsState);
        return (isCheckMate ? 2 : 1);
    }

}
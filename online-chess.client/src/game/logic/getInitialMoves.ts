import { GameObjects } from "phaser";
import BishopValidator from "../pieces/bishopValidator";
import KingValidator from "../pieces/kingValidator";
import KnightValidator from "../pieces/knightValidator";
import PawnValidator from "../pieces/pawnValidator";
import QueenValidator from "../pieces/queenValidator";
import RookValidator from "../pieces/rookValidator";
import { PieceNames } from "../utilities/constants";
import { IBothKingsPosition, IMoveHistory, IPhaserContextValues, IValidMove } from "../utilities/types";

export default class GetInitialMoves {
    private readonly board: (null | GameObjects.Sprite)[][]
    private readonly reactState: IPhaserContextValues;
    private readonly bothKingsPosition: IBothKingsPosition;
    private readonly boardOrientationIsWhite: boolean;
    private readonly moveHistory: IMoveHistory;

    constructor(
        board: (null | GameObjects.Sprite)[][],
        reactState: IPhaserContextValues,
        bothKingsPosition: IBothKingsPosition,
        boardOrientationIsWhite: boolean,
        moveHistory: IMoveHistory
    ) {
        this.board = board;
        this.reactState = reactState;
        this.bothKingsPosition = bothKingsPosition;
        this.boardOrientationIsWhite = boardOrientationIsWhite;
        this.moveHistory = moveHistory;
    }

    public getInitialMoves(name: PieceNames, x: number, y: number, uniqueName: string, allowXRayOpponentKing: boolean = false): IValidMove[]{
        let validMoves: IValidMove[] = [];

        switch(name){
            case PieceNames.bRook:
            case PieceNames.wRook:
                validMoves = (new RookValidator({ x, y, name, uniqueName }, this.board, this.moveHistory, allowXRayOpponentKing, this.bothKingsPosition)).validMoves();
                break;
            case PieceNames.bKnight:
            case PieceNames.wKnight:
                validMoves = (new KnightValidator({ x, y, name, uniqueName }, this.board, this.moveHistory, this.bothKingsPosition)).validMoves();
                break;
            case PieceNames.bBishop:
            case PieceNames.wBishop:
                validMoves = (new BishopValidator({ x, y, name, uniqueName }, this.board, this.moveHistory, allowXRayOpponentKing, this.bothKingsPosition)).validMoves();
                break;
            case PieceNames.bQueen:
            case PieceNames.wQueen:
                validMoves = (new QueenValidator({ x, y, name, uniqueName }, this.board, this.moveHistory, allowXRayOpponentKing, this.bothKingsPosition)).validMoves();
                break;
            case PieceNames.bKing:
                validMoves = (new KingValidator(
                    { x, y, name, uniqueName }, this.board, this.moveHistory, this.reactState.kingsState.black.isInCheck, this.bothKingsPosition, this.boardOrientationIsWhite)).validMoves();
                break;
            case PieceNames.wKing:
                validMoves = (new KingValidator(
                    { x, y, name, uniqueName }, this.board, this.moveHistory, this.reactState.kingsState.white.isInCheck, this.bothKingsPosition, this.boardOrientationIsWhite)).validMoves();
                break;
            case PieceNames.bPawn:
            case PieceNames.wPawn:
                //validMoves = (new PawnValidator(
                //    { piece: { x, y, name, uniqueName },
                //    board: this.board, moveHistory: this.reactState.moveHistory, showCaptureSquares: false })).validMoves();
                validMoves = (new PawnValidator(
                    { x, y, name, uniqueName }, this.board, this.moveHistory, false, this.bothKingsPosition, this.boardOrientationIsWhite)).validMoves();
                break;
            }
        return validMoves;
    }
}
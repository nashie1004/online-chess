import { GameObjects } from "phaser";
import BishopValidator from "../pieces/bishopValidator";
import KnightValidator from "../pieces/knightValidator";
import PawnValidator from "../pieces/pawnValidator";
import RookValidator from "../pieces/rookValidator";
import { PieceNames } from "../utilities/constants";
import { IPhaserContextValues, IBothKingsPosition, IMoveHistory, IKingState } from "../utilities/types";

export default class IsCheck {
    private readonly board: (null | GameObjects.Sprite)[][]
    private readonly reactState: IPhaserContextValues;
    private readonly bothKingsPosition: IBothKingsPosition;
    private readonly boardOrientationIsWhite: boolean;
    private readonly moveHistory: IMoveHistory;
    private readonly kingsState: IKingState;

    constructor(
        board: (null | GameObjects.Sprite)[][], 
        reactState: IPhaserContextValues, 
        bothKingsPosition: IBothKingsPosition, 
        boardOrientationIsWhite: boolean, 
        moveHistory: IMoveHistory,
        kingsState: IKingState
    ) {
        this.board = board;
        this.reactState = reactState;
        this.bothKingsPosition = bothKingsPosition;
        this.boardOrientationIsWhite = boardOrientationIsWhite;
        this.moveHistory = moveHistory;
        this.kingsState = kingsState;
    }
    
    /**
     * - gets the king position and validates if any opponent piece
     * can get to the current king square
     * @param isWhite
     * @returns
     */
    validateCheck(isWhite: boolean){
        const king = isWhite ? this.bothKingsPosition.black : this.bothKingsPosition.white;
        const kingPiece = isWhite ? PieceNames.bKing : PieceNames.wKing;
        const kingUpdate = (kingPiece === PieceNames.wKing) ? this.kingsState.white : this.kingsState.black;
        const _this = this;

        /**
         * 1. handle normal checks - once an opponent piece moves and their move causes a direct check
         * 2. discovered checks
         */
        // New Implementation
        // first get positon of king under check
        // then for each rook, bishop, knight move check if they attack the king

        const rookMoves = (new RookValidator(
            { x: king.x, y: king.y, name: kingPiece === PieceNames.wKing ? PieceNames.wRook : PieceNames.bRook }
            , this.board, this.moveHistory, false, this.bothKingsPosition)).validMoves();
        const bishopMoves = (new BishopValidator(
            { x: king.x, y: king.y, name: kingPiece === PieceNames.wKing ? PieceNames.wBishop : PieceNames.bBishop }
            , this.board, this.moveHistory, false, this.bothKingsPosition)).validMoves();
        const knightMoves = (new KnightValidator(
            { x: king.x, y: king.y, name: kingPiece === PieceNames.wKing ? PieceNames.wKnight : PieceNames.bKnight }
            , this.board, this.moveHistory, this.bothKingsPosition)).validMoves();
        const pawnMoves = (new PawnValidator(
                { x: king.x, y: king.y, name: kingPiece === PieceNames.wKing ? PieceNames.wPawn : PieceNames.bPawn },
                this.board, this.moveHistory, false, this.bothKingsPosition, this.boardOrientationIsWhite
            )).validMoves();

        // 1. rook
        rookMoves.forEach(rookMove => {
            const currTile = _this.board[rookMove.x][rookMove.y];
            if (!currTile) return;
            const currTileIsWhite = currTile.name[0] === "w";

            if (
                // opposite colors
                ((kingPiece === PieceNames.wKing && !currTileIsWhite) ||
                (kingPiece === PieceNames.bKing && currTileIsWhite)) &&
                (
                    (currTile.name.toLowerCase().indexOf("rook") >= 0) ||
                    (currTile.name.toLowerCase().indexOf("queen") >= 0)
                )
            ){
                kingUpdate.checkedBy.push({ x: rookMove.x, y: rookMove.y }); // under check
            }
        });

        // 2. bishop
        bishopMoves.forEach(rookMove => {
            const currTile = _this.board[rookMove.x][rookMove.y];
            if (!currTile) return;

            if (
                // opposite colors
                ((kingPiece === PieceNames.wKing && currTile.name[0] === "b") ||
                (kingPiece === PieceNames.bKing && currTile.name[0] === "w")) &&
                (
                    currTile.name.toLowerCase().indexOf("bishop") >= 0 ||
                    currTile.name.toLowerCase().indexOf("queen") >= 0
                )
            ){
                kingUpdate.checkedBy.push({ x: rookMove.x, y: rookMove.y }); // under check
            }
        });

        // 3. knight
        knightMoves.forEach(rookMove => {
            const currTile = _this.board[rookMove.x][rookMove.y];
            if (!currTile) return;

            if (
                // opposite colors
                ((kingPiece === PieceNames.wKing && currTile.name[0] === "b") ||
                (kingPiece === PieceNames.bKing && currTile.name[0] === "w")) &&
                (
                    currTile.name.toLowerCase().indexOf("knight") >= 0
                )
            ){
                kingUpdate.checkedBy.push({ x: rookMove.x, y: rookMove.y }); // under check
            }
        });

        // 4. ppawn
        pawnMoves.forEach(pawnMove => {
            const currTile = _this.board[pawnMove.x][pawnMove.y];
            if (!currTile) return;

            if (
                // opposite colors
                ((kingPiece === PieceNames.wKing && currTile.name[0] === "b") ||
                (kingPiece === PieceNames.bKing && currTile.name[0] === "w")) &&
                (
                    currTile.name.toLowerCase().indexOf("pawn") >= 0
                )
            ){
                kingUpdate.checkedBy.push({ x: pawnMove.x, y: pawnMove.y }); // under check
            }
        });

        // consolidate if there any checks/attackers
        if (kingUpdate.checkedBy.length > 0){
            kingUpdate.isInCheck = true;
            // remove any duplicate attackers/checkers
            kingUpdate.checkedBy = kingUpdate.checkedBy.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.x === value.x && t.y === value.y
                ))
            );

        }
        return kingUpdate.checkedBy.length > 0;
    }
}
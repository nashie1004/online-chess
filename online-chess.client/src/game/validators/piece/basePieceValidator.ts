import { GameObjects } from "phaser";
import { IMoveHistory, IPiece, IValidMove } from "../../utilities/types";

export default class BasePieceValidator{
    /**
     *
     */
    protected readonly board: (GameObjects.Sprite | null)[][] = []
    protected readonly moveHistory: IMoveHistory;
    protected readonly piece: IPiece;

    constructor(piece: IPiece, board: (GameObjects.Sprite | null)[][], moveHistory: IMoveHistory) {
        this.piece = piece;
        this.board = board;
        this.moveHistory = moveHistory;
    }

    protected isAFriendPiece(name: string): boolean{
        const bothWhite = name[0] === "w" && this.piece.name.toString()[0] === "w";
        const bothBlack = name[0] === "b" && this.piece.name.toString()[0] === "b";

        return bothWhite || bothBlack;
    }

    /**
     * - checks if the piece provided is out of bounds
     * @param col 
     * @param row 
     * @returns bool
     */
    protected isOutOfBounds(col: number, row: number){
        return col > 7 || row > 7 || 0 > col || 0 > row;
    }

    /**
     * - Override this
     * @param x 
     * @param y 
     * @returns a piece's valid moves
     */
    public validMoves(): IValidMove[]{
        return [];
    }
}
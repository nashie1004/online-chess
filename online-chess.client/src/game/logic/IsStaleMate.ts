import { GameObjects } from "phaser";
import { IBothKingsPosition, IKingState, IMoveHistory, IPhaserContextValues, IPiecesCoordinates } from "../utilities/types";
import GetInitialMoves from "./getInitialMoves";

export default class IsStalemate {
    private readonly pieceCoordinates: IPiecesCoordinates;
    private readonly board: (null | GameObjects.Sprite)[][]
    private readonly boardOrientationIsWhite: boolean;
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
     * - if any friend piece has atleast one move
     * @param isWhite 
     * @returns if player is stalemated
     */
    isStalemate(isWhite: boolean){
        let hasAtleastOneLegalMove = false;
        
        this.pieceCoordinates[isWhite ? "white" : "black"].forEach(friendPiece => {
            const {x, y, name, uniqueName} = friendPiece;

            const pieceMoves = (new GetInitialMoves(
                this.board
                , this.bothKingsPosition, this.boardOrientationIsWhite
                , this.moveHistory, this.kingsState
            )).getInitialMoves(name, x, y, uniqueName ?? `${name}-${x}-${y}`, false);

            if (pieceMoves.length > 0){
                hasAtleastOneLegalMove = true;
                return;
            }
        });

        return !hasAtleastOneLegalMove;
    }
}
import { GameObjects } from "phaser";
import { IBothKingsPosition, IPhaserContextValues, IPiecesCoordinates } from "../utilities/types";
import GetInitialMoves from "./getInitialMoves";

export default class IsStalemate {
    private readonly pieceCoordinates: IPiecesCoordinates;
    private readonly board: (null | GameObjects.Sprite)[][]
    private readonly boardOrientationIsWhite: boolean;
    private readonly reactState: IPhaserContextValues;
    private readonly bothKingsPosition: IBothKingsPosition;
    
    constructor(
        board: (null | GameObjects.Sprite)[][],
        boardOrientationIsWhite: boolean,
        pieceCoordinates: IPiecesCoordinates,
        reactState: IPhaserContextValues,
        bothKingsPosition: IBothKingsPosition
    ) {
        this.board = board;
        this.boardOrientationIsWhite = boardOrientationIsWhite;
        this.pieceCoordinates = pieceCoordinates;
        this.reactState = reactState;
        this.bothKingsPosition = bothKingsPosition;
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
                this.board, this.reactState
                , this.bothKingsPosition, this.boardOrientationIsWhite
            )).getInitialMoves(name, x, y, uniqueName ?? `${name}-${x}-${y}`, false);

            if (pieceMoves.length > 0){
                hasAtleastOneLegalMove = true;
                return;
            }
        });

        return !hasAtleastOneLegalMove;
    }
}
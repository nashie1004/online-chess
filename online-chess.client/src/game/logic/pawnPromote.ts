import { GameObjects } from "phaser";
import { PieceNames } from "../utilities/constants";
import { IPiecesCoordinates, PromoteTo } from "../utilities/types";

export default class PawnPromote {
    private readonly boardOrientationIsWhite: boolean;
    private readonly promoteTo: PromoteTo;
    private readonly pieceCoordinates: IPiecesCoordinates;

    constructor(
        boardOrientationIsWhite: boolean,
        promoteTo: PromoteTo,
        pieceCoordinates: IPiecesCoordinates
    ) {
        this.boardOrientationIsWhite = boardOrientationIsWhite;
        this.promoteTo = promoteTo;
        this.pieceCoordinates = pieceCoordinates;
    }

    pawnPromote(pieceName: string, newX: number, newY: number, isWhite: boolean, sprite: GameObjects.Sprite | null){
        let pawnPromoted = false;

        // check if pawn and promotable
        if (
            (pieceName.toLowerCase().indexOf("pawn") >= 0)
            && (
                (newY === 0 && isWhite && this.boardOrientationIsWhite) ||
                (newY === 7 && isWhite && !this.boardOrientationIsWhite) ||

                (newY === 7 && !isWhite && this.boardOrientationIsWhite) ||
                (newY === 0 && !isWhite && !this.boardOrientationIsWhite)
            )
            && sprite
        ){
            // change sprite name and image/texture from pawn to queen
            let newUniqueName = "";
            let pieceName: PieceNames = PieceNames.wQueen;

            switch(this.promoteTo){
                case "rook":
                    newUniqueName = (isWhite ? PieceNames.wRook : PieceNames.bRook) + `-${newX}-${newY}`; 
                    pieceName = isWhite ? PieceNames.wRook : PieceNames.bRook;

                    sprite.setName(newUniqueName);
                    sprite.setTexture(pieceName);
                    break;
                case "knight":
                    newUniqueName = (isWhite ? PieceNames.wKnight : PieceNames.bKnight) + `-${newX}-${newY}`;
                    pieceName = isWhite ? PieceNames.wKnight : PieceNames.bKnight;

                    sprite.setName(newUniqueName);
                    sprite.setTexture(pieceName);
                    break;
                case "bishop":
                    newUniqueName = (isWhite ? PieceNames.wBishop : PieceNames.bBishop) + `-${newX}-${newY}`;
                    pieceName = isWhite ? PieceNames.wBishop : PieceNames.bBishop;
                    
                    sprite.setName(newUniqueName);
                    sprite.setTexture(pieceName);
                    break;
                case "queen":
                    newUniqueName = (isWhite ? PieceNames.wQueen : PieceNames.bQueen) + `-${newX}-${newY}`;
                    pieceName = isWhite ? PieceNames.wQueen : PieceNames.bQueen;

                    sprite.setName(newUniqueName);
                    sprite.setTexture(pieceName);
                    break;
            }
                
            pawnPromoted = true;
            
            const newlyPromotedPawn = this.pieceCoordinates[isWhite ? "white" : "black"].find(i => i.x === newX && i.y === newY);
            if (!newlyPromotedPawn) return pawnPromoted;

            newlyPromotedPawn.uniqueName = newUniqueName;
            newlyPromotedPawn.name = pieceName;
        }

        return pawnPromoted;
    }
}
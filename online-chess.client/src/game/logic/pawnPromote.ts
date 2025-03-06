import { GameObjects } from "phaser";
import { PieceNames, PromotionPrefence } from "../utilities/constants";
import { IPiecesCoordinates, PlayersPromotePreference } from "../utilities/types";

export default class PawnPromote {
    private readonly boardOrientationIsWhite: boolean;
    private readonly promoteTo: PlayersPromotePreference;
    private readonly pieceCoordinates: IPiecesCoordinates;
    private readonly piecesUI: string;

    constructor(
        boardOrientationIsWhite: boolean,
        promoteTo: PlayersPromotePreference,
        pieceCoordinates: IPiecesCoordinates,
        piecesUI: string
    ) {
        this.boardOrientationIsWhite = boardOrientationIsWhite;
        this.promoteTo = promoteTo;
        this.pieceCoordinates = pieceCoordinates;
        this.piecesUI = piecesUI;
    }

    pawnPromote(pieceName: string, newX: number, newY: number, isWhite: boolean, sprite: GameObjects.Sprite | null){
        let pawnPromoted = false;
        const playerPromotionChoice = this.promoteTo[isWhite ? "white" : "black"]

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

            switch(playerPromotionChoice){
                case PromotionPrefence.Rook:
                    newUniqueName = (isWhite ? PieceNames.wRook : PieceNames.bRook) + `-${newX}-${newY}`; 
                    pieceName = isWhite ? PieceNames.wRook : PieceNames.bRook;

                    break;
                case PromotionPrefence.Knight:
                    newUniqueName = (isWhite ? PieceNames.wKnight : PieceNames.bKnight) + `-${newX}-${newY}`;
                    pieceName = isWhite ? PieceNames.wKnight : PieceNames.bKnight;

                    break;
                case PromotionPrefence.Bishop:
                    newUniqueName = (isWhite ? PieceNames.wBishop : PieceNames.bBishop) + `-${newX}-${newY}`;
                    pieceName = isWhite ? PieceNames.wBishop : PieceNames.bBishop;
                    
                    break;
                case PromotionPrefence.Queen:
                    newUniqueName = (isWhite ? PieceNames.wQueen : PieceNames.bQueen) + `-${newX}-${newY}`;
                    pieceName = isWhite ? PieceNames.wQueen : PieceNames.bQueen;

                    break;
            }

            sprite.setName(newUniqueName);
            sprite.setTexture(`${this.piecesUI}-${newUniqueName.split("-")[0]}`);
                
            pawnPromoted = true;
            
            const newlyPromotedPawn = this.pieceCoordinates[isWhite ? "white" : "black"].find(i => i.x === newX && i.y === newY);
            if (!newlyPromotedPawn) return pawnPromoted;

            newlyPromotedPawn.uniqueName = newUniqueName;
            newlyPromotedPawn.name = pieceName;
        }

        return pawnPromoted;
    }
}
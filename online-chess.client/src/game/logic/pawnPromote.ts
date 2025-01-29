import { GameObjects } from "phaser";
import { PieceNames } from "../utilities/constants";
import { IPhaserContextValues, PromoteTo } from "../utilities/types";

export default class PawnPromote {
    private readonly boardOrientationIsWhite: boolean;
    private readonly reactState: IPhaserContextValues;
    private readonly promoteTo: PromoteTo;

    constructor(
        boardOrientationIsWhite: boolean,
        reactState: IPhaserContextValues,
        promoteTo: PromoteTo
    ) {
        this.reactState = reactState;
        this.boardOrientationIsWhite = boardOrientationIsWhite;
        this.promoteTo = promoteTo;
    }

    pawnPromote(pieceName: string, newX: number, newY: number, isWhite: boolean, sprite: GameObjects.Sprite | null){

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
            switch(this.promoteTo){
                case "rook":
                    sprite.setName((isWhite ? PieceNames.wRook : PieceNames.bRook) + `-${newX}-${newY}`);
                    sprite.setTexture(isWhite ? PieceNames.wRook : PieceNames.bRook);
                    break;
                case "knight":
                    sprite.setName((isWhite ? PieceNames.wKnight : PieceNames.bKnight) + `-${newX}-${newY}`);
                    sprite.setTexture(isWhite ? PieceNames.wKnight : PieceNames.bKnight);
                    break;
                case "bishop":
                    sprite.setName((isWhite ? PieceNames.wBishop : PieceNames.bBishop) + `-${newX}-${newY}`);
                    sprite.setTexture(isWhite ? PieceNames.wBishop : PieceNames.bBishop);
                    break;
                case "queen":
                    sprite.setName((isWhite ? PieceNames.wQueen : PieceNames.bQueen) + `-${newX}-${newY}`);
                    sprite.setTexture(isWhite ? PieceNames.wQueen : PieceNames.bQueen);
                    break;
                }
        }
    }
}
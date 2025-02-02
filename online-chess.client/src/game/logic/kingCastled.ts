import { GameObjects } from "phaser";
import KingValidator from "../pieces/kingValidator";
import { PieceNames } from "../utilities/constants";
import { IBothKingsPosition, IMoveInfo, IMoveHistory, IPiecesCoordinates } from "../utilities/types";

export default class KingCastled {
    
    private readonly board: (null | GameObjects.Sprite)[][]
    private readonly bothKingsPosition: IBothKingsPosition;
    private readonly boardOrientationIsWhite: boolean;
    private readonly moveHistory: IMoveHistory;
    private readonly pieceCoordinates: IPiecesCoordinates;

    constructor(
        board: (null | GameObjects.Sprite)[][],
        bothKingsPosition: IBothKingsPosition,
        boardOrientationIsWhite: boolean,
        moveHistory: IMoveHistory,
        pieceCoordinates: IPiecesCoordinates
    ) {
        this.board = board;
        this.bothKingsPosition = bothKingsPosition;
        this.boardOrientationIsWhite = boardOrientationIsWhite;
        this.moveHistory = moveHistory;
        this.pieceCoordinates = pieceCoordinates;
    }

    
    public kingCastled(pieceName: string, selectedPiece: IMoveInfo, isWhite: boolean, newX: number, newY: number){
        // check if king piece
        if (pieceName.toLowerCase().indexOf("king") >= 0){
            const kingValidator = new KingValidator(
                {
                    x: selectedPiece.x, y: selectedPiece.y
                    , name: isWhite ? PieceNames.wKing : PieceNames.bKing
                    , uniqueName: pieceName
                }
                    , this.board, this.moveHistory, false
                    , this.bothKingsPosition
                    , this.boardOrientationIsWhite
            );

            const validKingSide = kingValidator.validKingSideCastling(selectedPiece.x, selectedPiece.y);
            const validQueenSide = kingValidator.validQueenSideCastling(selectedPiece.x, selectedPiece.y);

            // check what castle side
            // if the new king position is the same as a valid castle position
            let isKingSideCastle: boolean | null = null;

            if (validKingSide && validKingSide.x === newX && validKingSide.y === newY){
                isKingSideCastle = true;
            } else if (validQueenSide && validQueenSide.x === newX && validQueenSide.y === newY){
                isKingSideCastle = false;
            }

            // if a castle move is actually performed
            if (isKingSideCastle !== null)
            {
                const rookKingSideCastleInfo = {
                    oldX: selectedPiece.x + (this.boardOrientationIsWhite ? 3 : -3),
                    newX: (selectedPiece.x + (this.boardOrientationIsWhite ? 3 : -3)) + (this.boardOrientationIsWhite ? -2 : 2)
                };

                const rookQueenSideCastleInfo = {
                    oldX: selectedPiece.x + (this.boardOrientationIsWhite ? -4 : 4),
                    newX: (selectedPiece.x + (this.boardOrientationIsWhite ? -4 : 4)) + (this.boardOrientationIsWhite ? 3 : -3)
                };

                const rook = {
                    oldX: (isKingSideCastle ? rookKingSideCastleInfo.oldX : rookQueenSideCastleInfo.oldX)
                    , newX: (isKingSideCastle ? rookKingSideCastleInfo.newX : rookQueenSideCastleInfo.newX)
                    , y: selectedPiece.y
                };

                const rookSprite = this.board[rook.oldX][rook.y];

                // change rook coords

                // 1.
                this.board[rook.oldX][rook.y] = null;
                this.board[rook.newX][rook.y] = rookSprite;

                // 2.
                const rookCoordinate = this.pieceCoordinates[isWhite ? "white" : "black"]
                    .find(i => i.x === rook.oldX && i.y === rook.y);
                
                if (rookCoordinate){
                    rookCoordinate.x = rook.newX;
                }

                return {
                    rookSprite, rook
                };

            }
        }

        return null;
    }
}
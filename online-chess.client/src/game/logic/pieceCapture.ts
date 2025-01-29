import { GameObjects } from "phaser";
import PawnValidator from "../pieces/pawnValidator";
import { PieceNames } from "../utilities/constants";
import { IPiecesCoordinates, IPhaserContextValues, IBothKingsPosition, IMoveInfo, IMoveHistory } from "../utilities/types";

export default class PieceCapture {
    private readonly board: (null | GameObjects.Sprite)[][]
    private readonly boardOrientationIsWhite: boolean;
    private readonly pieceCoordinates: IPiecesCoordinates;
    private readonly bothKingsPosition: IBothKingsPosition;
    private readonly moveHistory: IMoveHistory;

    constructor(
        board: (null | GameObjects.Sprite)[][],
        boardOrientationIsWhite: boolean,
        pieceCoordinates: IPiecesCoordinates,
        bothKingsPosition: IBothKingsPosition,
        moveHistory: IMoveHistory
    ) {
        this.board = board;
        this.boardOrientationIsWhite = boardOrientationIsWhite;
        this.pieceCoordinates = pieceCoordinates;
        this.bothKingsPosition = bothKingsPosition;
        this.moveHistory = moveHistory;
    }
    
    normalCapture(newX: number, newY: number, isWhite: boolean){
        // if there is an opponent piece in the desired square, capture it
        const opponentPiece = this.board[newX][newY];

        if (opponentPiece){

            // TODO as of 1/28/2025 - Reimplement capture history logic
            // save to capture history
            if (isWhite){
                //this.reactState.captureHistory.white.push({ x: newX, y: newY, pieceName: opponentPiece.name })
            } else {
                //this.reactState.captureHistory.black.push({ x: newX, y: newY, pieceName: opponentPiece.name })
            }

            this.pieceCoordinates[isWhite ? "black" : "white"] = 
                this.pieceCoordinates[isWhite ? "black" : "white"].filter(i => i.x !== newX || i.y !== newY);

            opponentPiece.destroy();
            return true;
        }

        return false;
    }

    enPassantCapture(pieceName: string, selectedPiece: IMoveInfo, isWhite: boolean, newX: number, newY: number): boolean{

        // check if pawn type
        if (pieceName.toLowerCase().indexOf("pawn") >= 0){

            // get the previous pawn' square before moving diagonally
            const pawnValidator = new PawnValidator(
                { x: selectedPiece.x, y: selectedPiece.y, name: isWhite ? PieceNames.wPawn : PieceNames.bPawn, uniqueName: pieceName }
                , this.board, this.moveHistory, false, this.bothKingsPosition, this.boardOrientationIsWhite);

            const validCapture = pawnValidator.validEnPassantCapture();

            if (validCapture){
                // since our current moved pawn is in the same y square value as the opponent
                // , (means the pawn is behind the opponent pawn) just subtract/add y direction
                const opponentPiece = this.board[validCapture.x][validCapture.y - pawnValidator.captureYDirection];

                if (opponentPiece && validCapture.x === newX && validCapture.y === newY){
                    opponentPiece.destroy();

                    this.pieceCoordinates[isWhite ? "black" : "white"] = 
                        this.pieceCoordinates[isWhite ? "black" : "white"].filter(i => i.x !== newX || i.y !== newY);

                    return true;
                }
            }

        }

        return false;
    }

}
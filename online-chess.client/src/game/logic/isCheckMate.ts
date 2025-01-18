import { GameObjects } from "phaser";
import KingValidator from "../pieces/kingValidator";
import { PieceNames } from "../utilities/constants";
import { IPhaserContextValues, IBothKingsPosition, IPiecesCoordinates, IBaseCoordinates } from "../utilities/types";
import GetInitialMoves from "./getInitialMoves";

export default class IsCheckMate {

    private readonly board: (null | GameObjects.Sprite)[][]
    private readonly reactState: IPhaserContextValues;
    private readonly bothKingsPosition: IBothKingsPosition;
    private readonly boardOrientationIsWhite: boolean;
    private readonly pieceCoordinates: IPiecesCoordinates;

    constructor(
        board: (null | GameObjects.Sprite)[][],
        reactState: IPhaserContextValues,
        bothKingsPosition: IBothKingsPosition,
        boardOrientationIsWhite: boolean,
        pieceCoordinates: IPiecesCoordinates
    ) {
        this.board = board;
        this.reactState = reactState;
        this.bothKingsPosition = bothKingsPosition;
        this.boardOrientationIsWhite = boardOrientationIsWhite;
        this.pieceCoordinates = pieceCoordinates;
    }

    /**
     * - Will run after a piece moves, and the move results in a check
     * - similar to possibleMovesIfKingInCheck()
     * @param name
     * @param initialValidMoves
     * @returns
     */
    isCheckmate(){
        const colorInCheckIsWhite = this.reactState.kingsState.white.isInCheck;
        const friendPieces = this.pieceCoordinates[colorInCheckIsWhite ? "white" : "black"];
        const attackersCoords = colorInCheckIsWhite ? this.reactState.kingsState.white.checkedBy
            : this.reactState.kingsState.black.checkedBy;
        const validMoves = { capturable: 0, movableKing: 0, blockable: 0 }; // for debug purposes
        const kingInCheckCoords = colorInCheckIsWhite ? this.bothKingsPosition.white : this.bothKingsPosition.black;

        if (attackersCoords.length < 0) return; // no attacker/checker

        friendPieces.forEach(friendPiece => {
            if (!friendPiece.uniqueName) return;

            const friendPieceName = friendPiece.uniqueName.split("-")[0] as PieceNames;

            const friendPieceMoves = (new GetInitialMoves(
                this.board, this.reactState
                , this.bothKingsPosition, this.boardOrientationIsWhite
            )).getInitialMoves(
                friendPieceName, friendPiece.x, friendPiece.y
                , friendPiece.uniqueName
            );

            // for each friend piece move
            // validate if they can: 1. capture attacker, 2. block attacker
            // 3. if piece is king can move
            friendPieceMoves.forEach(friendMove => {

                // loop through each attacker/checker (for normal and discovered checks)
                attackersCoords.forEach(attacker => {

                    // 0. attacker information
                    const attackerSprite = this.board[attacker.x][attacker.y];
                    if (!attackerSprite) return null; // this is actually invalid
                    const attackerSpriteName = attackerSprite.name.split("-")[0] as PieceNames;
                    const attackerSquares = (new GetInitialMoves(
                        this.board, this.reactState,
                        this.bothKingsPosition, this.boardOrientationIsWhite
                    )).getInitialMoves(attackerSpriteName, attacker.x, attacker.y, attackerSprite.name, true);

                    // 1. Capture attacker
                    if (attacker.x === friendMove.x && attacker.y === friendMove.y){
                        validMoves.capturable++;
                    }

                    // 2. Move the checked king
                    if (friendPieceName === PieceNames.wKing || friendPieceName === PieceNames.bKing){
                        const kingCapturableTile = attackerSquares.find(attackerSquare => attackerSquare.x === friendMove.x && attackerSquare.y === friendMove.y);
                        if (!kingCapturableTile){
                            validMoves.movableKing++;
                        }
                    }

                    // 3. Block the line of attack
                    const kingTracer = new KingValidator({
                        x: kingInCheckCoords.x, y: kingInCheckCoords.y, name: colorInCheckIsWhite ? PieceNames.wKing : PieceNames.bKing
                    }, this.board, this.reactState.moveHistory, false, this.bothKingsPosition, this.boardOrientationIsWhite);

                    let attackersLineOfPath: IBaseCoordinates[] = [];

                    // trace the position of king in check and position of attacker
                    switch(attackerSpriteName){
                        case PieceNames.wBishop:
                        case PieceNames.bBishop:
                            attackersLineOfPath = kingTracer.traceDiagonalPath(attacker);
                            break;
                        case PieceNames.wRook:
                        case PieceNames.bRook:
                            attackersLineOfPath = kingTracer.traceStraightPath(attacker);
                            break;
                        case PieceNames.wQueen:
                        case PieceNames.bQueen:
                            const queenStraightPath = kingTracer.traceStraightPath(attacker);

                            if (queenStraightPath.length <= 0){
                                attackersLineOfPath = kingTracer.traceDiagonalPath(attacker);
                            } else {
                                attackersLineOfPath = queenStraightPath;
                            }

                            break;
                    }

                    // if a friend move blocks any attackers line of attack
                    const blockableTiles = attackersLineOfPath.filter(attackerLineOfPath =>
                        attackerLineOfPath.x === friendMove.x && attackerLineOfPath.y === friendMove.y
                    );

                    // attacker's line of attack can be blocked by current friend piece
                    if (blockableTiles.length > 0){
                        validMoves.blockable += blockableTiles.length;
                    }

                });

            });
        });

        const validMovesTotal = validMoves.capturable + validMoves.blockable + validMoves.movableKing;
        //console.info(`number of legal/valid moves that prevent checkmate: `, validMovesTotal)
        return validMovesTotal <= 0;
    }
}
import { GameObjects } from "phaser";
import KingValidator from "../pieces/kingValidator";
import { PieceNames } from "../utilities/constants";
import { IMoveInfo, IPhaserContextValues, IBothKingsPosition, IValidMove, IBaseCoordinates, IMoveHistory } from "../utilities/types";
import GetInitialMoves from "./getInitialMoves";

export default class PossibleMovesIfKingInCheck {
    
    private readonly board: (null | GameObjects.Sprite)[][]
    private readonly selectedPiece: IMoveInfo | null;
    private readonly reactState: IPhaserContextValues;
    private readonly bothKingsPosition: IBothKingsPosition;
    private readonly boardOrientationIsWhite: boolean;
    private readonly moveHistory: IMoveHistory;
    
    constructor(
        board: (null | GameObjects.Sprite)[][],
        selectedPiece: IMoveInfo | null,
        reactState: IPhaserContextValues,
        bothKingsPosition: IBothKingsPosition,
        boardOrientationIsWhite: boolean,
        moveHistory: IMoveHistory
    ) {
        this.board = board;
        this.selectedPiece = selectedPiece;
        this.reactState = reactState;
        this.bothKingsPosition = bothKingsPosition;
        this.boardOrientationIsWhite = boardOrientationIsWhite;
        this.moveHistory = moveHistory;
    }

    
    possibleMovesIfKingInCheck(name: PieceNames, initialValidMoves: IValidMove[]){

        // both kings are not in check
        if (!this.reactState.kingsState.black.isInCheck && !this.reactState.kingsState.white.isInCheck){
            return null;
        }

        // === Start check legal moves === //
        const isWhite = name[0] === "w";

        // get attacker(s) information
        const attackersCoords = isWhite ? this.reactState.kingsState.white.checkedBy : this.reactState.kingsState.black.checkedBy;
        if (attackersCoords.length <= 0) return null; // no check

        attackersCoords.forEach(attacker => {

            const attackerSprite = this.board[attacker.x][attacker.y];
            if (!attackerSprite) return null; // this is actually invalid
            const attackerSpriteName = attackerSprite.name.split("-")[0] as PieceNames;

            /**
             * possible moves when in check are
             * - move the king
             * - block the attacker
             * - capture the attacker
             */
            const actualValidMoves: IValidMove[] = [];

            // 1. capture the attacker (with any friend piece)
            initialValidMoves.forEach(move => {
                if (attacker.x === move.x && attacker.y === move.y){
                    actualValidMoves.push(move);
                }
            });

            // 2. move the king
            // get attacker piece attack squares (rook, bishop, queen)
            // , filter out those attack squares with the king
            // and also include x ray (moves behind the king that is in check by attacker)
            const attackerSquares = (new GetInitialMoves(
                this.board, this.reactState, 
                this.bothKingsPosition, this.boardOrientationIsWhite,
                this.moveHistory
            )).getInitialMoves(attackerSpriteName, attacker.x, attacker.y, attackerSprite.name, true)
            
            if (name === PieceNames.wKing || name === PieceNames.bKing)
            {
                initialValidMoves.forEach(kingMove => {
                    const dangerSquare = attackerSquares.find(attackerSquare => attackerSquare.x === kingMove.x && attackerSquare.y === kingMove.y);

                    if (!dangerSquare){
                        actualValidMoves.push(kingMove);
                    }
                });
            }

            // 3. block the attacker - (only for enemy rook, bishop, queen)
            /**
             * - get the attacker direction of attack (diagonal, horizontal, vertical)
             * - for each square of the attackers line of attack, loop through via queenvalidator
             * and knightvalidator to see if a friend piece can go/block that square
             */
            const kingInCheckCoords = isWhite ? this.bothKingsPosition.white : this.bothKingsPosition.black;
            const kingTracer = new KingValidator({
                x: kingInCheckCoords.x, y: kingInCheckCoords.y, name: isWhite ? PieceNames.wKing : PieceNames.bKing
            }, this.board, this.moveHistory, false, this.bothKingsPosition, this.boardOrientationIsWhite);
            let attackersLineOfPath: IBaseCoordinates[] = [];

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

            // get all friend piece,
            // for each attackers line of path (square), generate friend queen, knight, pawn move
            // and see if they can block that attacker square
            if (attackersLineOfPath.length > 0)
            {
                for(let i = 0; i < this.board.length; i++){
                    for(let j = 0; j < this.board[i].length; j++){

                        // the block move is only possible selected/clicked piece
                        if (this.selectedPiece && this.selectedPiece.x === j && this.selectedPiece.y === i) {
                            const currTile = this.board[j][i];
                            if (!currTile) continue;
                            const spriteName = currTile.name.split("-")[0] as PieceNames;

                            // get friend piece moves
                            if (
                                (isWhite && currTile.name[0] === "w") ||
                                (!isWhite && currTile.name[0] === "b")
                            ){
                                const friendPieceMoves = (new GetInitialMoves(
                                    this.board, this.reactState,
                                    this.bothKingsPosition, this.boardOrientationIsWhite,
                                    this.moveHistory
                                )).getInitialMoves(spriteName, j, i, currTile.name);
                                // if one of our friend move can block an enemey attack sqaure
                                attackersLineOfPath.forEach(attackSquare => {
                                    const blockable = friendPieceMoves.find(friendMove => friendMove.x === attackSquare.x && friendMove.y === attackSquare.y);
                                    if (blockable){
                                        actualValidMoves.push(blockable);
                                    }
                                });
                            }
                        }


                    }
                }
            }

            // this just removes any duplicate valid moves so that phaser setVisible will actually work
            // https://stackoverflow.com/questions/2218999/how-to-remove-all-duplicates-from-an-array-of-objects
            initialValidMoves = actualValidMoves.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.x === value.x && t.y === value.y
                ))
            );

        });


        return initialValidMoves;
        // === End check legal moves === //
    }
}
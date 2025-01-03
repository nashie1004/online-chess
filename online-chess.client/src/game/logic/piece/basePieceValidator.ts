import { GameObjects } from "phaser";
import { IBothKingsPosition, IMoveHistory, IPiece, IPinInfo, IPinMove, IValidMove } from "../../utilities/types";

export default class BasePieceValidator{
    /**
     *
     */
    protected readonly board: (GameObjects.Sprite | null)[][] = []
    protected readonly moveHistory: IMoveHistory;
    protected readonly piece: IPiece;
    protected readonly bothKingsPosition: IBothKingsPosition;

    constructor(piece: IPiece, board: (GameObjects.Sprite | null)[][], moveHistory: IMoveHistory, bothKingsPosition: IBothKingsPosition) {
        this.piece = piece;
        this.board = board;
        this.moveHistory = moveHistory;
        this.bothKingsPosition = bothKingsPosition;
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

    /**
     * - this method is only for non-king pieces
     * - only rook, bishops, queens can pin
     * - if a piece is pinned, can only move in forward or backwards in the same direction as 
     * the enemy pinning piece or capture the enemy pinning piece
     * @returns pin info - if pinned and what squares are legal
     */
    protected validateAbsolutelyPinned(): IPinInfo {
        let pinInfo: IPinInfo = { isPinned: false, restrictedToX: null, restrictedToY: null };

        if (this.piece.name.toLowerCase().indexOf("king") >= 0) return pinInfo;

        const pieceIsWhite = this.piece.name[0] === "w";

        // get friend king, simulate rook, and bishop moves
        const friendKingCoords = pieceIsWhite ? this.bothKingsPosition.white : this.bothKingsPosition.black;

        // 1. Rook Moves
        const directions = [
            { x: 0, y: -1 },
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
        ]

        // simulate rook moves from the friend king position
        // allow x ray for any tile type (empty, friend, opponent)
        // since we want if for the line of path, there are 1 opponent piece
        // and 1 friend piece
        directions.forEach(direction => {

            let row = friendKingCoords.y;
            let col = friendKingCoords.x;
            const rookMoves: IPinMove[] = []; // { isEnemey: bool, isFriend: bool, isEmptyTile: bool, coords: IBaseCoods }

            while (row >= 0 && row <= 7 && col >= 0 && col <= 7) {
                row += direction.y;
                col += direction.x;
                if (row === friendKingCoords.y && col === friendKingCoords.x) continue; // same tile
                if (this.isOutOfBounds(col, row)) break; // out of bounds

                const currTile = this.board[col][row];

                if (currTile) {

                    if (this.isAFriendPiece(currTile.name)) {
                        rookMoves.push({
                            isEnemy: false, isFriend: true, isEmptyTile: false,
                            coords: { x: col, y: row }
                        });
                    }
                    else {
                        rookMoves.push({
                            isEnemy: true, isFriend: false, isEmptyTile: false,
                            coords: { x: col, y: row }
                        });
                    }

                    continue;
                } 

                rookMoves.push({
                    isEnemy: false, isFriend: false, isEmptyTile: true,
                    coords: { x: col, y: row }
                });

            }

            /**
             * Pinning enemy rook or queen logic:
             * - for each king rook move direction...
             * - check if there is: 1 friend and 1 opponent
             */
            const blockingFriendPieces = rookMoves.filter(rookMove => {
                if (rookMove.isFriend) return rookMove;
            });
            const pinningEnemyPiece = rookMoves.find(rookMove => {
                if (rookMove.isEnemy) return rookMove;
            });


            // 1. check if there is an enemy piece in the line of attack
            if (!pinningEnemyPiece) return;

            const currEnemyTile = this.board[pinningEnemyPiece.coords.x][pinningEnemyPiece.coords.y];

            // 2. not an empty tile
            if (!currEnemyTile) return;

            // 3.1 Identify if the enemy piece is a rook or queen
            const enemyIsARookOrQueen = (currEnemyTile.name.toLowerCase().indexOf("rook") >= 0
                || currEnemyTile.name.toLowerCase().indexOf("queen") >= 0);

            if (!enemyIsARookOrQueen) return;

            // 3.2 identify if piece is enemy
            const enemyIsWhite = currEnemyTile.name[0] === "w";

            if ((pieceIsWhite && enemyIsWhite) || (!pieceIsWhite && !enemyIsWhite)) return;

            // 4.1 no friend block piece or there are 2 or more friend pieces in the king's line of path
            if (blockingFriendPieces.length > 1 || blockingFriendPieces.length < 1) return;

            // 4.2 blocking piece is this class itself
            const blockingFriendPiece = blockingFriendPieces[0];
            if (blockingFriendPiece.coords.x !== this.piece.x && blockingFriendPiece.coords.y !== this.piece.y) return;

            // 5. check if the enemy rook, friend piece blocking, and friend king are on the same col/row

            // all 3 are in the same column
            const linedUpSameCol = (
                (pinningEnemyPiece.coords.x === blockingFriendPiece.coords.x) &&
                (blockingFriendPiece.coords.x === this.piece.x) &&
                (this.piece.x === pinningEnemyPiece.coords.x)
            );

            // all 3 are in the same row
            const linedUpSameRow = (
                (pinningEnemyPiece.coords.y === blockingFriendPiece.coords.y) &&
                (blockingFriendPiece.coords.y === this.piece.y) &&
                (this.piece.y === pinningEnemyPiece.coords.y)
            );

            if (!linedUpSameCol && !linedUpSameRow) return;

            // All 3 pieces are on the same col or row
            // check if there are on the proper order
            
            if (linedUpSameCol) {

                if (
                    (pinningEnemyPiece.coords.y > blockingFriendPiece.coords.y) &&
                    (blockingFriendPiece.coords.y > friendKingCoords.y)
                ) {
                    console.log(`1. LINED UP enemy pinning piece: `, pinningEnemyPiece, ` blocking piece: `, this.piece, ` friend king: `, friendKingCoords)
                }
                else if (
                    (friendKingCoords.y > blockingFriendPiece.coords.y) &&
                    (blockingFriendPiece.coords.y > pinningEnemyPiece.coords.y) 
                ) {
                    console.log(`2. LINED UP enemy pinning piece: `, pinningEnemyPiece, ` blocking piece: `, this.piece, ` friend king: `, friendKingCoords)
                }

                pinInfo = { isPinned: true, restrictedToX: this.piece.x, restrictedToY: null };
            } 
            else if (linedUpSameRow) {

                if (
                    (pinningEnemyPiece.coords.x > blockingFriendPiece.coords.x) &&
                    (blockingFriendPiece.coords.x > friendKingCoords.x)
                ) {
                    console.log(`3. LINED UP enemy pinning piece: `, pinningEnemyPiece, ` blocking piece: `, this.piece, ` friend king: `, friendKingCoords)
                }
                else if (
                    (friendKingCoords.x > blockingFriendPiece.coords.x) &&
                    (blockingFriendPiece.coords.x > pinningEnemyPiece.coords.x)
                ) {
                    console.log(`4. LINED UP enemy pinning piece: `, pinningEnemyPiece, ` blocking piece: `, this.piece, ` friend king: `, friendKingCoords)
                }

                pinInfo = { isPinned: true, restrictedToX: null, restrictedToY: this.piece.y };
            }

        })

        // 2. Bishop Moves

        return pinInfo;
    }
}
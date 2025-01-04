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
     * - this method is used by this.filterLegalMovesWhenPinned() below
     * @returns pin info - if pinned and what squares are legal
     */
    protected validateAbsolutelyPinned(): IPinInfo {
        let pinInfo: IPinInfo = { isPinned: false, restrictedToCol: null, restrictedToRow: null, isRook: true };

        if (this.piece.name.toLowerCase().indexOf("king") >= 0) return pinInfo;

        const pieceIsWhite = this.piece.name[0] === "w";

        // get friend king, simulate rook, and bishop moves
        const friendKingCoords = pieceIsWhite ? this.bothKingsPosition.white : this.bothKingsPosition.black;

        /** ==== 1. ROOK MOVES === */
        const rookDirections = [
            { x: 0, y: -1 },
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
        ]

        // simulate rook moves from the friend king position
        // allow x ray for any tile type (empty, friend, opponent)
        // since we want if for the line of path, there are 1 opponent piece
        // and 1 friend piece
        rookDirections.forEach(direction => {

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
                    (
                        (pinningEnemyPiece.coords.y > blockingFriendPiece.coords.y) &&
                        (blockingFriendPiece.coords.y > friendKingCoords.y)
                    )
                    ||
                    (
                        (friendKingCoords.y > blockingFriendPiece.coords.y) &&
                        (blockingFriendPiece.coords.y > pinningEnemyPiece.coords.y) 
                    )
                ) {
                    //console.log(`1. LINED UP enemy pinning piece: `, pinningEnemyPiece, ` blocking piece: `, this.piece, ` friend king: `, friendKingCoords)
                    pinInfo = { isPinned: true, restrictedToCol: this.piece.x, restrictedToRow: null, isRook: true };
                }

            } 
            else if (linedUpSameRow) {

                if (
                    (
                        (pinningEnemyPiece.coords.x > blockingFriendPiece.coords.x) &&
                        (blockingFriendPiece.coords.x > friendKingCoords.x)
                    )
                    ||
                    (
                        (friendKingCoords.x > blockingFriendPiece.coords.x) &&
                        (blockingFriendPiece.coords.x > pinningEnemyPiece.coords.x)
                    )
                ) {
                    //console.log(`2. LINED UP enemy pinning piece: `, pinningEnemyPiece, ` blocking piece: `, this.piece, ` friend king: `, friendKingCoords)
                    pinInfo = { isPinned: true, restrictedToCol: null, restrictedToRow: this.piece.y, isRook: true };
                }
            }

        })

        /** ==== 2. BISHOP MOVES === */
        const bishopDirections = [
            { x: -1, y: -1 } // Top Left: -x, -y
            , { x: -1, y: 1 } // Bottom Left: -x, +y
            , { x: 1, y: -1 } // Top Right: +x, -y
            , { x: 1, y: 1 } // Bottom Right: +x, +y
        ]

        bishopDirections.forEach(direction => {

            let row = friendKingCoords.y;
            let col = friendKingCoords.x;
            const bishopMoves: IPinMove[] = [];

            while (row >= 0 && col >= 0 && row <= 7 && col <= 7) {
                row += direction.y;
                col += direction.x;

                if (this.isOutOfBounds(col, row)) continue;

                const currTile = this.board[col][row]

                if (currTile) {

                    if (this.isAFriendPiece(currTile.name)) {
                        bishopMoves.push({
                            isEnemy: false, isFriend: true, isEmptyTile: false,
                            coords: { x: col, y: row }
                        });
                    }
                    else {
                        bishopMoves.push({
                            isEnemy: true, isFriend: false, isEmptyTile: false,
                            coords: { x: col, y: row }
                        });
                    }

                    continue;
                }

                bishopMoves.push({
                    isEnemy: false, isFriend: false, isEmptyTile: true,
                    coords: { x: col, y: row }
                });
            }


            /**
             * Pinning enemy bishop or queen logic:
             * - for each king bishop move direction...
             * - check if there is: 1 friend and 1 opponent
             */
            const blockingFriendPieces = bishopMoves.filter(bishopMove => {
                if (bishopMove.isFriend) return bishopMove;
            });
            const pinningEnemyPiece = bishopMoves.find(bishopMove => {
                if (bishopMove.isEnemy) return bishopMove;
            });

            // 1. check if there is an enemy piece in the line of attack
            if (!pinningEnemyPiece) return;

            const currEnemyTile = this.board[pinningEnemyPiece.coords.x][pinningEnemyPiece.coords.y];

            // 2. not an empty tile
            if (!currEnemyTile) return;

            // 3.1 Identify if the enemy piece is a bishop or queen
            const enemyIsABishopOrQueen = (currEnemyTile.name.toLowerCase().indexOf("bishop") >= 0
                || currEnemyTile.name.toLowerCase().indexOf("queen") >= 0);

            if (!enemyIsABishopOrQueen) return;

            // 3.2 identify if piece is enemy
            const enemyIsWhite = currEnemyTile.name[0] === "w";

            if ((pieceIsWhite && enemyIsWhite) || (!pieceIsWhite && !enemyIsWhite)) return;

            // 4.1 no friend block piece or there are 2 or more friend pieces in the king's line of path
            if (blockingFriendPieces.length > 1 || blockingFriendPieces.length < 1) return;

            // 4.2 blocking piece is this class itself
            const blockingFriendPiece = blockingFriendPieces[0];
            if (blockingFriendPiece.coords.x !== this.piece.x && blockingFriendPiece.coords.y !== this.piece.y) return;

            // 5. check if the enemy rook, friend piece blocking, and friend king are on the same col/row and in the corect order

            // all 3 are in the same column
            const linedUp1 = (Math.abs(pinningEnemyPiece.coords.y - blockingFriendPiece.coords.y)
                === Math.abs(pinningEnemyPiece.coords.x - blockingFriendPiece.coords.x));

            // all 3 are in the same row
            const linedUp2 = (Math.abs(blockingFriendPiece.coords.y - friendKingCoords.x)
                === Math.abs(blockingFriendPiece.coords.x - friendKingCoords.y));

            if (!linedUp1 && !linedUp2) return;

            // returns something like [0 ,4]
            const endsCol = [pinningEnemyPiece.coords.x, friendKingCoords.x];
            const endsRow = [pinningEnemyPiece.coords.y, friendKingCoords.y];

            pinInfo = {
                isPinned: true
                // fills up missing whole number for example
                // [0, 4] becomes [0, 1,2,3, 4]
                // [4, 0] becomes [4, 3,2,1, 0]
                , restrictedToCol: Array.from(
                    { length: Math.abs(endsCol[1] - endsCol[0]) + 1 },
                    (_, i) => endsCol[0] + (endsCol[0] < endsCol[1] ? i : -i)
                )
                , restrictedToRow: Array.from(
                    { length: Math.abs(endsRow[1] - endsRow[0]) + 1 },
                    (_, i) => endsRow[0] + (endsRow[0] < endsRow[1] ? i : -i)
                )
                , isRook: false
            }
        });

        return pinInfo;
    }

    /**
     * - this method will check if this piece/class is in pinned to its king and
     *  filter out the legal moves 
     * @param validMoves
     * @returns modified validMoves[]
     */
    protected filterLegalMovesWhenPinned(validMoves: IValidMove[]): IValidMove[] {

        // this will check if this piece is absolutely pinned to its friend king
        const absolutePinFilter = this.validateAbsolutelyPinned();

        //console.log(absolutePinFilter, this.piece, validMoves)

        if (absolutePinFilter.isPinned) {

            validMoves = validMoves.filter(initialValidMove => {

                // 1. enemy rook or queen (just a number)
                // this will just check if the legal move is in the same rank or file 
                if (absolutePinFilter.isRook && typeof absolutePinFilter.restrictedToCol === "number" && typeof absolutePinFilter.restrictedToRow === "number") {

                    if (absolutePinFilter.restrictedToCol && initialValidMove.x === absolutePinFilter.restrictedToCol) {
                        return initialValidMove;
                    }
                    else if (absolutePinFilter.restrictedToRow && initialValidMove.y === absolutePinFilter.restrictedToRow) {
                        return initialValidMove;
                    }
                }

                // 2. enemy bishop or queen (an array/tuple)
                // this will just check if the enemy bishop/queen, friend blocking piece
                // and friend king are in the same diagonal and in the right order
                else if (!absolutePinFilter.isRook && Array.isArray(absolutePinFilter.restrictedToCol) && Array.isArray(absolutePinFilter.restrictedToRow)) {

                    for (let i = 0; i < absolutePinFilter.restrictedToRow.length; i++) {
                        const restrictedToTile = { x: absolutePinFilter.restrictedToCol[i], y: absolutePinFilter.restrictedToRow[i] };

                        if (
                            absolutePinFilter.restrictedToCol[i] === initialValidMove.x &&
                            absolutePinFilter.restrictedToRow[i] === initialValidMove.y
                        ) {
                            return initialValidMove;
                        }

                    }

                }

            });

        }

        return validMoves;
    }

}
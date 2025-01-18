import { GameObjects, Scene } from "phaser";
import bg from "../../assets/wood4-800x800.jpg"
import previewMove from "../../assets/indicator.png"
import move from "../../assets/sounds/Move.ogg"
import capture from "../../assets/sounds/Capture.ogg"
import select from "../../assets/sounds/Select.ogg"
import check from "../../assets/sounds/Check.mp3"
import pieces, { Options as gameOptions, PieceNames, pieceImages, baseKingState } from "../utilities/constants";
import { IBaseCoordinates, IBothKingsPosition, IKingState, IMoveInfo, INonTilePieces, IPhaserContextValues, IPiecesCoordinates, IValidMove, PromoteTo } from "../utilities/types";
import KingValidator from "../pieces/kingValidator";
import PawnValidator from "../pieces/pawnValidator";
import { eventEmitter } from "../utilities/eventEmitter";
import GetInitialMoves from "../logic/getInitialMoves";
import IsStalemate from "../logic/IsStaleMate";
import IsCheck from "../logic/isCheck";
import PossibleMovesIfKingInCheck from "../logic/possibleMovesIfKingInCheck";

export class MainGameScene extends Scene{
    /**
     * Board: 800 x 800, Square: 100
     * unique name = piecename + x + y, example: 'wPawn-0-6'
     */
    private readonly tileSize: number;
    private readonly board: (null | GameObjects.Sprite)[][]
    private readonly previewBoard: (GameObjects.Sprite)[][] // has a visible property
    private selectedPiece: IMoveInfo | null;
    private reactState: IPhaserContextValues;
    private bothKingsPosition: IBothKingsPosition;
    private readonly boardOrientationIsWhite: boolean;
    private readonly pieceCoordinates: IPiecesCoordinates;

    constructor(key: string, isColorWhite: boolean) {
        super({ key });

        // sync react and phaser state
        this.reactState = {
            isWhitesTurn: true,
            moveHistory: { white: [], black: [] },
            captureHistory: { white: [], black: [] },
            promoteTo: "queen",
            isColorWhite, // player's color of choice
            isWhitesOrientation: isColorWhite,
            kingsState: baseKingState
        }

        // game internal state
        this.selectedPiece = null;
        this.boardOrientationIsWhite = isColorWhite;
        this.bothKingsPosition = {
            // if black orientation switch queen and king coords
            white: { x: this.boardOrientationIsWhite ? 4 : 3, y: this.boardOrientationIsWhite ? 7 : 0 }
            , black: { x: this.boardOrientationIsWhite ? 4 : 3, y: this.boardOrientationIsWhite ? 0 : 7 }
        };

        this.tileSize = gameOptions.tileSize; // 100

        // creates 8x8 grid
        this.board = Array.from({ length: 8}).map(_ => new Array(8).fill(null));
        this.previewBoard = Array.from({ length: 8 }).map(_ => new Array(8));

        this.pieceCoordinates = {
            white: [],
            black: [],
        };

    }

    // Load assets
    preload(){
        this.load.image("bg", bg);
        this.load.image("previewMove", previewMove)
        this.load.audio("move", move);
        this.load.audio("capture", capture);
        this.load.audio("select", select);
        this.load.audio("check", check);

        Object.entries(pieceImages).forEach(([pieceName, imagePath]) => {
            const blob = new Blob([imagePath], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            this.load.svg(pieceName, url, { width: this.tileSize, height: this.tileSize })
        })
    }

    create(){

        this.add.image(0, 0, "bg").setOrigin(0, 0) ;
        const select = this.sound.add("select");

        // create pieces

        // 1. preview moves
        this.board.forEach((row, rowIdx) => {
            row.forEach((_, colIdx) => {

                const previewMove =  this.add
                    .sprite(colIdx * this.tileSize, rowIdx * this.tileSize, "previewMove")
                    .setName(`previewMove-${colIdx}-${rowIdx}`)
                    .setOrigin(0, 0)
                    .setDepth(1)
                    .setVisible(false)
                    .setInteractive({ cursor: "pointer" })
                    .on("pointerover", () => { previewMove.setTint(0x98DEC7) })
                    .on("pointerout", () => { previewMove.clearTint() })
                    .on("pointerdown", () => this.move(colIdx, rowIdx), this)
                    .setAlpha(.5)
                    ;

                this.previewBoard[colIdx][rowIdx] = previewMove;
            })
        })

        // 2. actual pieces
        pieces.forEach(piece => {
            let { name, x, y } = piece;
            const pieceIsWhite = name[0] === "w";

            // if black orientation
            if (!this.boardOrientationIsWhite) {

                // flip y
                y = Math.abs(y - 7);

                // if king and or queen
                if (name.toLowerCase().indexOf("king") >= 0) {
                    x = 3;
                } else if (name.toLowerCase().indexOf("queen") >= 0) {
                    x = 4;
                }
            }

            const uniqueName = `${name}-${x}-${y}`;
            this.pieceCoordinates[pieceIsWhite ? "white" : "black"].push({
                name, x, y, uniqueName
            });

            const sprite = this.add
                .sprite(x * this.tileSize, y * this.tileSize, name.toString(), 1)
                .setOrigin(0, 0)
                .setName(uniqueName)
                .setInteractive({  cursor: "pointer" })
                .on("pointerover", () => {

                    // not allowed to move
                    if (
                        (name[0] !== "w" && this.reactState.isWhitesTurn) ||
                        (name[0] !== "b" && !this.reactState.isWhitesTurn)
                    ){
                        return;
                    }

                    sprite.setTint(0x98DEC7)
                })
                .on("pointerout", () => {
                    sprite.clearTint()
                 })
                .on("pointerdown", () => {

                    // not allowed to move
                    if (
                        (name[0] !== "w" && this.reactState.isWhitesTurn) ||
                        (name[0] !== "b" && !this.reactState.isWhitesTurn)
                    ){
                        return;
                    }

                    // use latest sprite name
                    // since on this.move() > pawn promotion the sprite name gets change
                    const pieceName = sprite.name.split("-")[0] as PieceNames
                    const pieceX = Number(sprite.name.split("-")[1])
                    const pieceY = Number(sprite.name.split("-")[2])

                    // show available moves
                    select.play();
                    this.resetMoves();
                    this.showPossibleMoves(pieceName, pieceX, pieceY);
                })
;
            this.board[x][y] = sprite;
        })

        // reset if click out of a select piece
        this.input.on("pointerdown", (_: Phaser.Input.Pointer, clickedSprite: GameObjects.Sprite[] | undefined) => {
            if (!clickedSprite || !this.selectedPiece) {
                return;
            }

            // if there is a selected piece and the clicked area has no sprite
            if (this.selectedPiece && clickedSprite.length < 1){
                this.resetMoves();
            }
        })

        // sync / listen to upcoming react state changes
        eventEmitter.on("setPromoteTo", (data: PromoteTo) => this.reactState.promoteTo = data);
        eventEmitter.on("setIsWhitesOrientation", (data: boolean) => this.reactState.isWhitesOrientation = data);
        eventEmitter.on("setKingsState", (data: IKingState) => this.reactState.kingsState = data);
    }

    resetMoves(){
        // reset selected piece
        this.selectedPiece = null;

        // reset preview
        this.previewBoard.forEach((row, rowIdx) => {
            row.forEach((_, colIdx) => {
                if (this.previewBoard[colIdx][rowIdx].visible){
                    this.previewBoard[colIdx][rowIdx].setVisible(false);
                }
            })
        })
    }

    /**
     * - once a piece is clicked, this func will run
     * to toggle/show possible moves and display ui preview squares to the user
     * - also filters down player moves if the king is in check
     * @param name
     * @param x
     * @param y
     */
    showPossibleMoves(name: PieceNames, x: number, y: number){
        // actual coords
        const uniqueName = `${name}-${x}-${y}`;
        const actualCoordinates = this.findPieceCoordinates(uniqueName);
        x = actualCoordinates?.x ?? 0;
        y = actualCoordinates?.y ?? 0;

        // validate
        let initialValidMoves: IValidMove[] = (new GetInitialMoves(
            this.board, this.reactState, 
            this.bothKingsPosition, this.boardOrientationIsWhite
        )).getInitialMoves(name, x, y, uniqueName);

        // set selected piece
        this.selectedPiece = { x, y, pieceName: uniqueName };

        // this returns null if the king isnt in check
        const actualValidMoves = (new PossibleMovesIfKingInCheck(
            this.board, this.selectedPiece
            ,this.reactState, this.bothKingsPosition
            ,this.boardOrientationIsWhite
        )).possibleMovesIfKingInCheck(name, initialValidMoves);
        
        if (actualValidMoves){
            initialValidMoves = actualValidMoves;
        }

        // handle absolute king pins

        // UI - shows the actual valid moves to the user
        initialValidMoves.forEach(item => {
            const prev = this.previewBoard[item.x][item.y].visible;
            this.previewBoard[item.x][item.y].setVisible(!prev)
        })
    }




    /**
     * - move piece to desired square
     * - saves capture history
     * - saves move history
     * @param newX
     * @param newY
     * @returns if the move has capture
     */
    move(newX: number, newY: number){
        let hasCapture = false;

        if (!this.selectedPiece) return hasCapture;

        // current piece to move
        const sprite = this.board[this.selectedPiece.x][this.selectedPiece.y];
        if (!sprite) return false;

        const isWhite = sprite?.name[0] === "w"
        const pieceName = sprite?.name ?? "";
        this.reactState.isWhitesTurn = !isWhite;

        // old coordinate
        this.board[this.selectedPiece.x][this.selectedPiece.y] = null;

        // capture
        if (this.mNormalCapture(newX, newY, isWhite)) hasCapture = true;
        if (this.mEnPassantCapture(pieceName, this.selectedPiece, isWhite, newX, newY)) hasCapture = true;

        // new coordinate
        this.board[newX][newY] = sprite;

        // This is for stalemate detection
        const pieceCoordinate = this.pieceCoordinates[isWhite ? "white" : "black"]
            .find(i => i.x === this.selectedPiece?.x && i.y === this.selectedPiece?.y);

        if (pieceCoordinate){
            pieceCoordinate.x = newX;
            pieceCoordinate.y = newY;
        }

        // some special logic
        this.mPawnPromote(pieceName, newX, newY, isWhite, sprite);

        this.mKingCastle(pieceName, this.selectedPiece, isWhite, newX, newY);

        this.mSaveMoveHistory(isWhite, pieceName, this.selectedPiece, newX, newY);

        // if the move is a king, update private king pos state - this is used by the this.validateCheckOrCheckMateOrStalemate() function
        if (sprite.name.toLowerCase().indexOf("king") >= 0){
            this.bothKingsPosition[isWhite ? "white" : "black"].x = newX;
            this.bothKingsPosition[isWhite ? "white" : "black"].y = newY;
        }

        // transfer data from phaser to react
        eventEmitter.emit("setIsWhitesTurn", !isWhite)
        eventEmitter.emit("setMoveHistory", this.reactState.moveHistory)
        eventEmitter.emit("setCaptureHistory", this.reactState.captureHistory)

        // display move to the user
        this.tweens.add({
            targets: [sprite],
            x: newX * this.tileSize,
            y: newY * this.tileSize,
            ease: "Expo.easeInOuts",
            duration: 100,
        })

        this.resetMoves();

        // check for check or checkmate
        const kingSafety = this.validateCheckOrCheckMateOrStalemate(isWhite);

        // play sound
        hasCapture ? this.sound.play("capture") : this.sound.play("move");
        if (kingSafety !== 0) this.sound.play("check");
    }

    // find by name
    findPieceCoordinates(uniqueName: string){
        for (let i = 0; i < this.board.length; i++){
            for(let j = 0; j < this.board[i].length; j++){

                const currTile = this.board[j][i];

                // empty tile
                if (!currTile) continue;

                // found coords
                if (currTile.name === uniqueName) return ({ x: j, y: i })
            }
        }
    }

    update(){
        // may not need this
    }

    mNormalCapture(newX: number, newY: number, isWhite: boolean){
        // if there is an opponent piece in the desired square, capture it
        const opponentPiece = this.board[newX][newY];

        if (opponentPiece){

            // save to capture history
            if (isWhite){
                this.reactState.captureHistory.white.push({ x: newX, y: newY, pieceName: opponentPiece.name })
            } else {
                this.reactState.captureHistory.black.push({ x: newX, y: newY, pieceName: opponentPiece.name })
            }

            this.pieceCoordinates[isWhite ? "black" : "white"] = 
                this.pieceCoordinates[isWhite ? "black" : "white"].filter(i => i.x !== newX || i.y !== newY);

            opponentPiece.destroy();
            return true;
        }

        return false;
    }

    mEnPassantCapture(pieceName: string, selectedPiece: IMoveInfo, isWhite: boolean, newX: number, newY: number): boolean{

        // check if pawn type
        if (pieceName.toLowerCase().indexOf("pawn") >= 0){

            // get the previous pawn' square before moving diagonally
            const pawnValidator = new PawnValidator(
                { x: selectedPiece.x, y: selectedPiece.y, name: isWhite ? PieceNames.wPawn : PieceNames.bPawn, uniqueName: pieceName }
                , this.board, this.reactState.moveHistory, false, this.bothKingsPosition, this.boardOrientationIsWhite);

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

    mPawnPromote(pieceName: string, newX: number, newY: number, isWhite: boolean, sprite: GameObjects.Sprite | null){

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
            switch(this.reactState.promoteTo){
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

    mKingCastle(pieceName: string, selectedPiece: IMoveInfo, isWhite: boolean, newX: number, newY: number){
        /** === Start Castle ==== */
        // check if king piece
        if (pieceName.toLowerCase().indexOf("king") >= 0){
            const kingValidator = new KingValidator(
                {
                    x: selectedPiece.x, y: selectedPiece.y
                    , name: isWhite ? PieceNames.wKing : PieceNames.bKing
                    , uniqueName: pieceName
                }
                 , this.board, this.reactState.moveHistory, false
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

                // change coords
                this.board[rook.oldX][rook.y] = null;
                this.board[rook.newX][rook.y] = rookSprite;

                // display rook move to the user
                this.tweens.add({
                    targets: [rookSprite],
                    x: rook.newX * this.tileSize,
                    y: rook.y * this.tileSize,
                    ease: "Expo.easeInOuts",
                    duration: 100,
                })
            }
        }
        /** === End Castle ==== */
    }

    mSaveMoveHistory(isWhite: boolean, pieceName: string, selectedPiece: IMoveInfo, newX: number, newY: number){

        // save to move history
        if (isWhite){
            this.reactState.moveHistory.white.push({
                old: { pieceName, x: selectedPiece.x, y: selectedPiece.y },
                new: { pieceName, x: newX, y: newY },
            });
        } else {
            this.reactState.moveHistory.black.push({
                old: { pieceName, x: selectedPiece.x, y: selectedPiece.y },
                new: { pieceName, x: newX, y: newY },
            });
        }
    }

    /**
     *
     * @param sprite
     * @param isWhite
     * @param newX
     * @param newY
     * @returns 0 = no check or checkmate, 1 = check, 2 = checkmate, 3 = stalemate
     */
    validateCheckOrCheckMateOrStalemate(isWhite: boolean) : 0 | 1 | 2 {
        this.board[this.bothKingsPosition.black.x][this.bothKingsPosition.black.y]?.resetPostPipeline();
        this.board[this.bothKingsPosition.white.x][this.bothKingsPosition.white.y]?.resetPostPipeline();

        // reset all check or checkmate properties
        this.reactState.kingsState.black.checkedBy = [];
        this.reactState.kingsState.white.checkedBy = [];
        this.reactState.kingsState.white.isInCheck = false;
        this.reactState.kingsState.black.isInCheck = false;
        this.reactState.kingsState.white.isCheckMate = false;
        this.reactState.kingsState.black.isCheckMate = false;
        this.reactState.kingsState.white.isInStalemate = false;
        this.reactState.kingsState.black.isInStalemate = false;

        // check
        const isCheck = (new IsCheck(
            this.board, this.reactState
            ,this.bothKingsPosition, this.boardOrientationIsWhite
        )).validateCheck(isWhite);

        // 1. stalemate
        if (!isCheck){
            let isStalemate = (new IsStalemate(
                this.board, this.boardOrientationIsWhite
                ,this.pieceCoordinates, this.reactState
                ,this.bothKingsPosition
            )).isStalemate(!isWhite);

            if (isStalemate){
                this.reactState.kingsState[isWhite ? "black" : "white"].isInStalemate = true;
                return 0;
            }

            return 0;
        }

        // 2. check
        const king = isWhite ? this.bothKingsPosition.black : this.bothKingsPosition.white;
        const kingSprite = this.board[king.x][king.y];
        kingSprite?.postFX?.addGlow(0xE44C6A, 10, 2);

        // 3. checkmate 
        let isCheckMate = this.isCheckmate();

        if (isCheckMate){
            if (this.reactState.kingsState.white.isInCheck){
                this.reactState.kingsState.white.isCheckMate = true;
            } else {
                this.reactState.kingsState.black.isCheckMate = true;
            }
        }


        eventEmitter.emit("setKingsState", this.reactState.kingsState);
        return (isCheckMate ? 2 : 1);
    }

    /**
     *
     * @param getFriends - if true = returns all friend pieces, false = returns all opponent pieces
     * @returns object of (x, y, sprite)
     */
    getAllFriendOrOpponentPieces(getFriends: boolean = true, isWhite: boolean = true){
        const nonTilePieces: INonTilePieces[] = []

        for (let row = 0; row < this.board.length; row++){
            for (let col = 0; col < this.board[row].length; col++){
                const sprite = this.board[col][row];
                if (!sprite) continue;
                const spriteIsWhite = sprite.name[0] === "w";

                // 1. get only friends
                if (getFriends){
                    if (isWhite && spriteIsWhite){
                        nonTilePieces.push({ sprite, x: col, y: row })
                    } else if (!isWhite && !spriteIsWhite){
                        nonTilePieces.push({ sprite, x: col, y: row })
                    }
                }
                // 2. get only enemies
                else {
                    if (isWhite && !spriteIsWhite){
                        nonTilePieces.push({ sprite, x: col, y: row })
                    } else if (!isWhite && spriteIsWhite){
                        nonTilePieces.push({ sprite, x: col, y: row })
                    }
                }
            }
        }

        return nonTilePieces;
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
        const friendPieces = this.getAllFriendOrOpponentPieces(true, colorInCheckIsWhite);
        const attackersCoords = colorInCheckIsWhite ? this.reactState.kingsState.white.checkedBy
            : this.reactState.kingsState.black.checkedBy;
        const validMoves = { capturable: 0, movableKing: 0, blockable: 0 }; // for debug purposes
        const kingInCheckCoords = colorInCheckIsWhite ? this.bothKingsPosition.white : this.bothKingsPosition.black;

        if (attackersCoords.length < 0) return; // no attacker/checker

        friendPieces.forEach(friendPiece => {
            const friendPieceName = friendPiece.sprite.name.split("-")[0] as PieceNames;

            const friendPieceMoves = (new GetInitialMoves(
                this.board, this.reactState
                , this.bothKingsPosition, this.boardOrientationIsWhite
            )).getInitialMoves(
                friendPieceName, friendPiece.x, friendPiece.y
                , friendPiece.sprite.name
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
import { GameObjects, Scene } from "phaser";
import bg from "../assets/wood4-800x800.jpg"
import previewMove from "../assets/indicator.png"
import move from "../assets/sounds/Move.ogg"
import capture from "../assets/sounds/Capture.ogg"
import select from "../assets/sounds/Select.ogg"
import check from "../assets/sounds/Check.mp3"
import pieces, { baseKingState } from "../utils/constants";
import { gameOptions, PieceNames, pieceImages } from "../utils/constants";
import { IBaseCoordinates, IBothKingsPosition, IKingState, IMoveInfo, IPhaserContextValues, IValidMove, PromoteTo } from "../utils/types";
import { eventEmitter } from "./eventEmitter";
import RookValidator from "../validators/piece/rookValidator";
import KnightValidator from "../validators/piece/knightValidator";
import BishopValidator from "../validators/piece/bishopValidator";
import QueenValidator from "../validators/piece/queenValidator";
import KingValidator from "../validators/piece/kingValidator";
import PawnValidator from "../validators/piece/pawnValidator";

export class MainGameScene extends Scene{
    /**
     * Board: 800 x 800, Square: 100
     * unique name = piecename + x + y, example: 'wPawn-0-6'
     */
    private tileSize: number;
    private readonly board: (null | GameObjects.Sprite)[][]
    private readonly previewBoard: (GameObjects.Sprite)[][] // has a visible property
    private selectedPiece: IMoveInfo | null;
    private reactState: IPhaserContextValues;
    private bothKingsPosition: IBothKingsPosition;
    
    constructor() {
        super({ key: "MainGame" });

        // sync react and phaser state
        this.reactState = {
            isWhitesTurn: true,
            moveHistory: { white: [], black: [] },
            captureHistory: { white: [], black: [] },
            promoteTo: "queen",
            isColorWhite: true, // player's color of choice
            isWhitesOrientation: true,
            kingsState: baseKingState
        }        

        // game internal state
        this.selectedPiece = null;
        this.bothKingsPosition = { white: { x: 4, y: 7 }, black: { x: 4, y: 0 } };

        this.tileSize = gameOptions.tileSize; // 100
        
        // creates 8x8 grid
        this.board = Array.from({ length: 8}).map(_ => new Array(8).fill(null));
        this.previewBoard = Array.from({ length: 8}).map(_ => new Array(8));
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
            const { name, x, y } = piece;

            const sprite = this.add
                .sprite(x * this.tileSize, y * this.tileSize, name.toString(), 1)
                .setOrigin(0, 0)
                .setName(`${name}-${x}-${y}`)
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

    // gets available moves
    showPossibleMoves(name: PieceNames, x: number, y: number){
        // actual coords
        const uniqueName = `${name}-${x}-${y}`;
        const actualCoordinates = this.findPieceCoordinates(uniqueName);
        x = actualCoordinates?.x ?? 0;
        y = actualCoordinates?.y ?? 0;

        // validate
        let initialValidMoves: IValidMove[] = this.getInitialMoves(name, x, y, uniqueName);
            
        // set selected piece
        this.selectedPiece = { x, y, pieceName: uniqueName };

        // === Start check legal moves === //
        // check if the king is in check
        if (this.reactState.kingsState.black.isInCheck || this.reactState.kingsState.white.isInCheck){
            const isWhite = name[0] === "w";
            
            // get attacker information
            const attackerCoords = isWhite ? this.reactState.kingsState.white.checkedBy : this.reactState.kingsState.black.checkedBy;
            if (!attackerCoords) return; // this is actually invalid
            const attackerSprite = this.board[attackerCoords.x][attackerCoords.y];
            if (!attackerSprite) return; // this is actually invalid
            const attackerSpriteName = attackerSprite.name.split("-")[0] as PieceNames;
            
            /**
             * possible moves when in check are
             * - move the king
             * - block the attacker
             * - capture the attacker
             */
            const actualValidMoves: IValidMove[] = [];

            // 1. capture the attacker
            initialValidMoves.forEach(move => {
                if (attackerCoords.x === move.x && attackerCoords.y === move.y){
                    actualValidMoves.push(move);
                }
            });

            // 2. move the king
            // get attacker piece attack squares (rook, bishop, queen)
            // , filter out those attack squares with the king
            const dangerSquares = this.getInitialMoves(attackerSpriteName, attackerCoords.x, attackerCoords.y, attackerSprite.name)    
            if (name === PieceNames.wKing || name === PieceNames.bKing)
            {
                initialValidMoves.forEach(kingMove => {
                    const dangerSquare = dangerSquares.find(dangerSquare => dangerSquare.x === kingMove.x && dangerSquare.y === kingMove.y);
                    
                    if (!dangerSquare){
                        actualValidMoves.push(kingMove);
                    } 
                });
            }
            
            // 3. block the attacker

            // this just removes any duplicate valid moves so that phaser setVisible will actually work
            // https://stackoverflow.com/questions/2218999/how-to-remove-all-duplicates-from-an-array-of-objects
            initialValidMoves = actualValidMoves.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.x === value.x && t.y === value.y
                ))
            );
        }
        // === End check legal moves === //

        // UI - shows the actual valid moves to the user
        initialValidMoves.forEach(item => {
            const prev = this.previewBoard[item.x][item.y].visible;
            this.previewBoard[item.x][item.y].setVisible(!prev)
        })
    }

    getInitialMoves(name: PieceNames, x: number, y: number, uniqueName: string){
        let validMoves: IValidMove[] = [];
        
        switch(name){
            case PieceNames.bRook:
            case PieceNames.wRook:
                validMoves = (new RookValidator({ x, y, name, uniqueName }, this.board, this.reactState.moveHistory)).validMoves();
                break;
            case PieceNames.bKnight:
            case PieceNames.wKnight:
                validMoves = (new KnightValidator({ x, y, name, uniqueName }, this.board, this.reactState.moveHistory)).validMoves();
                break;
            case PieceNames.bBishop:
            case PieceNames.wBishop:
                validMoves = (new BishopValidator({ x, y, name, uniqueName }, this.board, this.reactState.moveHistory)).validMoves();
                break;
            case PieceNames.bQueen:
            case PieceNames.wQueen:
                validMoves = (new QueenValidator({ x, y, name, uniqueName }, this.board, this.reactState.moveHistory)).validMoves();
                break;
            case PieceNames.bKing:
            case PieceNames.wKing:
                validMoves = (new KingValidator({ x, y, name, uniqueName }, this.board, this.reactState.moveHistory)).validMoves();
                break;
            case PieceNames.bPawn:
            case PieceNames.wPawn:
                validMoves = (new PawnValidator({ x, y, name, uniqueName }, this.board, this.reactState.moveHistory)).validMoves();
                break;
            }
        return validMoves;
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
        
        // some special logic
        this.mPawnPromote(pieceName, newX, newY, isWhite, sprite);

        this.mKingCastle(pieceName, this.selectedPiece, isWhite, newX, newY);
        
        this.mSaveMoveHistory(isWhite, pieceName, this.selectedPiece, newX, newY);

        // if the move is a king, update private king pos state - this is used by the this.mKingInCheckOrCheckmate() function
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
        const kingSafety = this.mKingInCheckOrCheckmate(sprite, isWhite, newX, newY);

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
        // TODO: handle movehistory, capturehistory and who will move next
        if (this.reactState.isWhitesTurn){
            // console.info(`White's turn to move`)
        } else {
            // console.info(`Black's turn to move`)
        }

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
                { 
                    x: selectedPiece.x, y: selectedPiece.y
                    , name: isWhite ? PieceNames.wPawn : PieceNames.bPawn
                    , uniqueName: pieceName 
                }
                 , this.board, this.reactState.moveHistory
            );

            const validCapture = pawnValidator.validEnPassantCapture();
            
            if (validCapture){
                // since our current moved pawn is in the same y square value as the opponent
                // , (means the pawn is behind the opponent pawn) just subtract/add y direction
                const opponentPiece = this.board[validCapture.x][validCapture.y - pawnValidator.captureYDirection];
                
                if (opponentPiece && validCapture.x === newX && validCapture.y === newY){
                    opponentPiece.destroy();
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
            && ((newY === 0 && isWhite) || newY === 7 && !isWhite)
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
                 , this.board, this.reactState.moveHistory
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
                const rook = { 
                    oldX: (isKingSideCastle ? selectedPiece.x + 3 : selectedPiece.x - 4)
                    , newX: (isKingSideCastle ? (selectedPiece.x + 3) - 2 : (selectedPiece.x - 4) + 3)
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
     * @returns 0 = no check or checkmate, 1 = check, 2 = checkmate
     */
    mKingInCheckOrCheckmate(sprite: GameObjects.Sprite, isWhite: boolean, newX: number, newY: number) : 0 | 1 | 2 {
        this.board[this.bothKingsPosition.black.x][this.bothKingsPosition.black.y]?.resetPostPipeline(); 
        this.board[this.bothKingsPosition.white.x][this.bothKingsPosition.white.y]?.resetPostPipeline(); 

        const isCheck = this.validateCheck(sprite, isWhite, newX, newY);

        // 1. no check or no checkmate
        if (!isCheck){
            this.reactState.kingsState.black.checkedBy = null;
            this.reactState.kingsState.white.checkedBy = null;

            this.reactState.kingsState.black.isInCheck = false;
            this.reactState.kingsState.white.isInCheck = false;
            return 0;
        }
        
        // 2. check
        
        if (isWhite){
            this.reactState.kingsState.black.checkedBy = { x: newX, y: newY };
            this.reactState.kingsState.black.isInCheck = true;
        } else {
            this.reactState.kingsState.white.checkedBy = { x: newX, y: newY };
            this.reactState.kingsState.white.isInCheck = true;
        }

        const king = isWhite ? this.bothKingsPosition.black : this.bothKingsPosition.white;
        const kingSprite = this.board[king.x][king.y]; 
        kingSprite?.postFX?.addGlow(0xE44C6A, 10, 2);

        // 3. checkmate
        const isCheckMate = this.validateCheckmate(isWhite);
        if (isCheckMate){
            if (isWhite){
                this.reactState.kingsState.black.isCheckMate = true;
            } else {
                this.reactState.kingsState.white.isCheckMate = true;
            }
        }
        
        eventEmitter.emit("setKingsState", this.reactState.kingsState);
        return (isCheckMate ? 2 : 1);
    }
    
    validateCheck(enemy: GameObjects.Sprite, isWhite: boolean, enemyX: number, enemyY: number){
        const enemyName = enemy.name.split("-")[0] as PieceNames;
        const king = isWhite ? this.bothKingsPosition.black : this.bothKingsPosition.white;
        const kingPiece = isWhite ? PieceNames.bKing : PieceNames.wKing;

        // compare the given enemy coordinates with the king
        const checkValidator = new KingValidator(
            { x: king.x, y: king.y, name: kingPiece, uniqueName: enemy.name }
            , this.board, this.reactState.moveHistory
        );

        return checkValidator.validateCheck(enemyX, enemyY, enemyName);
    }

    // TODO
    validateCheckmate(isWhite: boolean){
        // todo 1: if king is in check, run through all legal moves and check if there is at least one legal move
        // todo 2: if no more legal move, means checkmate
        let checkMate = false;
        return checkMate;
        const friendPieces: IBaseCoordinates[] = [];

        this.board.forEach((row, rowIdx) => {
            row.forEach((sprite, colIdx) => {
                if (sprite?.name[0] === "w" && isWhite){
                    friendPieces.push({ x: colIdx, y: rowIdx });
                } else if (sprite?.name[0] === "b" && !isWhite){
                    friendPieces.push({ x: colIdx, y: rowIdx });
                }
            });
        });

        //
        friendPieces.forEach(piece => {
            // this.board[]
        });

        return checkMate;
    }

}
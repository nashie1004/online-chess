import { GameObjects } from "phaser";
import { PieceNames } from "../utilities/constants";
import { IPiecesCoordinates, IMoveInfo, IPhaserContextValues, IBothKingsPosition, IValidMove, IMoveHistory, IKingState } from "../utilities/types";
import GetInitialMoves from "./getInitialMoves";
import PossibleMovesIfKingInCheck from "./possibleMovesIfKingInCheck";

export default class ShowPossibleMoves {
    
    private readonly board: (null | GameObjects.Sprite)[][]
    private readonly previewBoard: (GameObjects.Sprite)[][] // has a visible property
    private readonly boardOrientationIsWhite: boolean;
    private readonly pieceCoordinates: IPiecesCoordinates;
    private readonly reactState: IPhaserContextValues;
    private readonly bothKingsPosition: IBothKingsPosition;
    private readonly moveHistory: IMoveHistory;
    private selectedPiece: IMoveInfo | null;
    private readonly kingsState: IKingState;

    constructor(
        board: (null | GameObjects.Sprite)[][],
        previewBoard: (GameObjects.Sprite)[][],
        boardOrientationIsWhite: boolean,
        pieceCoordinates: IPiecesCoordinates,
        selectedPiece: IMoveInfo | null,
        reactState: IPhaserContextValues,
        bothKingsPosition: IBothKingsPosition,
        moveHistory: IMoveHistory,
        kingsState: IKingState
    ) {
        this.board = board;        
        this.previewBoard = previewBoard;        
        this.boardOrientationIsWhite = boardOrientationIsWhite;        
        this.pieceCoordinates = pieceCoordinates;        
        this.selectedPiece = selectedPiece;        
        this.reactState = reactState;        
        this.bothKingsPosition = bothKingsPosition;      
        this.moveHistory = moveHistory;  
        this.kingsState = kingsState;
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
        const isWhite = name[0] === "w";
        const actualCoordinates = this.pieceCoordinates[isWhite ? "white" : "black"].find(i => i.uniqueName === uniqueName);
        if (!actualCoordinates) return null;

        x = actualCoordinates.x;
        y = actualCoordinates.y;

        // validate
        let initialValidMoves: IValidMove[] = (new GetInitialMoves(
            this.board, this.reactState, 
            this.bothKingsPosition, this.boardOrientationIsWhite,
            this.moveHistory, this.kingsState
        )).getInitialMoves(name, x, y, uniqueName);

        // set selected piece
        this.selectedPiece = { x, y, pieceName: uniqueName };

        // this returns null if the king isnt in check
        const actualValidMoves = (new PossibleMovesIfKingInCheck(
            this.board, this.selectedPiece
            ,this.reactState, this.bothKingsPosition
            ,this.boardOrientationIsWhite
            ,this.moveHistory, this.kingsState
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

        return this.selectedPiece;
    }

}
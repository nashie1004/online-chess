import { GameType } from "../game/utilities/constants";
import { gameStat, IChat, IMoveHistory, IPiece, IPlayerInfo, PromotionPrefence } from "../game/utilities/types";

export interface IGameContextReducerState{
    messages: IChat[];
    gameRoomKey: string | null;
    moveHistory: IMoveHistory;
    captureHistory: IPiece[];
    myInfo: IPlayerInfo;
    opponentInfo: IPlayerInfo;
    gameStatus: gameStat;
    gameType: GameType;
}

export type IGameContextReducerActions = 
| { type: "SET_MESSAGES"; payload: IChat[] }
| { type: "SET_GAMEROOMKEY"; payload: string }
| { type: "SET_MOVEHISTORY"; payload: any } 
| { type: "SET_CAPTUREHISTORY"; payload: IPiece }

| { type: "SET_MYINFO"; payload: IPlayerInfo }
| { type: "SET_MYINFO_TIMELEFT"; payload: number }
| { type: "SET_MYINFO_PROMOTEPAWNTO"; payload: PromotionPrefence }
| { type: "SET_MYINFO_ISPLAYERSTURN"; payload: boolean } 
| { type: "SET_MYINFO_OPENPROMOTIONMODAL"; payload: boolean } 
| { type: "SET_OPPONENTINFO"; payload: IPlayerInfo }
| { type: "SET_OPPONENTINFO_TIMELEFT"; payload: number }
| { type: "SET_OPPONENTINFO_PROMOTEPAWNTO"; payload: PromotionPrefence } 
| { type: "SET_OPPONENTINFO_ISPLAYERSTURN"; payload: boolean } 

| { type: "SET_GAMESTATUS"; payload: gameStat }
| { type: "SET_CLEARGAMESTATE"; }
| { type: "SET_OPPONENTINFO_REQUESTDRAW"; payload: boolean }
| { type: "SET_GAMETYPE"; payload: GameType };

export interface IGameContext{
    gameState: IGameContextReducerState;
    setGameState: React.Dispatch<IGameContextReducerActions>;
}

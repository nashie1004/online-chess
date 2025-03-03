import { IOnReceiveMessages } from "../game/signalRhandlers/types";
import { GameType, PromotionPrefence } from "../game/utilities/constants";
import { customMessageType, gameStat, ICustomMesage, IKing, IMoveHistory, IPiece, IPieceMove, IPlayerInfo, IUser } from "../game/utilities/types";

export interface IAuthContext {
    isAuthenticating: boolean;
    setIsAuthenticating: React.Dispatch<React.SetStateAction<boolean>>;
    user: IUser | null;
    setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
    login: (user: IUser) => void;
    logout: () => void;
}


export interface IGameContextReducerState{
    messages: IOnReceiveMessages[];
    gameRoomKey: string | null;
    moveHistory: IMoveHistory;
    captureHistory: IPiece[];
    myInfo: IPlayerInfo;
    opponentInfo: IPlayerInfo;
    gameStatus: gameStat;
    gameType: GameType;
}

export interface IMoveHistoryAppend{
    moveInfo: IPieceMove;
    moveIsWhite: boolean;
}

export type IGameContextReducerActions = 
| { type: "SET_MESSAGES"; payload: IOnReceiveMessages[] }
| { type: "SET_GAMEROOMKEY"; payload: string }
| { type: "SET_MOVEHISTORY"; payload: IMoveHistory } 
| { type: "SET_MOVEHISTORY_APPEND"; payload: IMoveHistoryAppend } 
| { type: "SET_CAPTUREHISTORY"; payload: IPiece[] }
| { type: "SET_CAPTUREHISTORY_APPEND"; payload: IPiece }

| { type: "SET_MYINFO"; payload: IPlayerInfo }
| { type: "SET_MYINFO_TIMELEFT"; payload: number }
| { type: "SET_MYINFO_PROMOTEPAWNTO"; payload: PromotionPrefence }
| { type: "SET_MYINFO_ISPLAYERSTURN"; payload: boolean } 
| { type: "SET_MYINFO_OPENPROMOTIONMODAL"; payload: boolean } 
| { type: "SET_MYINFO_KINGSTATE"; payload: IKing } 
| { type: "SET_OPPONENTINFO"; payload: IPlayerInfo }
| { type: "SET_OPPONENTINFO_TIMELEFT"; payload: number }
| { type: "SET_OPPONENTINFO_PROMOTEPAWNTO"; payload: PromotionPrefence } 
| { type: "SET_OPPONENTINFO_ISPLAYERSTURN"; payload: boolean } 
| { type: "SET_OPPONENTINFO_KINGSTATE"; payload: IKing } 

| { type: "SET_GAMESTATUS"; payload: gameStat }
| { type: "SET_CLEARGAMESTATE"; }
| { type: "SET_OPPONENTINFO_REQUESTDRAW"; payload: boolean }
| { type: "SET_GAMETYPE"; payload: GameType };

export interface IGameContext{
    gameState: IGameContextReducerState;
    setGameState: React.Dispatch<IGameContextReducerActions>;
}

export interface IInitializerContext{
    setInitialize: React.Dispatch<React.SetStateAction<boolean>>;
}



export interface INotificationContext{
    notificationState: INotificationContextReducerState;
    setNotificationState: React.Dispatch<INotificationContextReducerActions>;
}

export interface INotificationContextReducerState{
    customMessage: string | null;
    customMessageType: customMessageType;
    hasAGameQueuing: boolean;
    hasAGameDisconnected: boolean;
    signalRConnectionDisconnected: boolean;
    hasAGameOnGoing: boolean;
    roomKey: string | null;
    asOfDate: Date | null;
}

export type INotificationContextReducerActions = 
{ type: "SET_CUSTOMMESSAGE", payload: ICustomMesage }
| { type: "SET_HASAGAMEQUEUINGROOMKEY", payload: boolean }
| { type: "SET_HASAGAMEDISCONNECTED", payload: boolean }
| { type: "SET_SIGNALRCONNECTIONDISCONNECTED", payload: boolean }
| { type: "SET_HASAGAMEONGOING", payload: boolean }
| { type: "SET_ROOMKEY", payload: string }
| { type: "SET_ASOFDATE", payload: Date }
| { type: "SET_RESETNOTIFICATIONS" }
;

export interface IQueuingContext {
    queuingRoomKey: string | null;
    setQueuingRoomKey: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface ISignalRContext {
    startConnection: () => Promise<boolean>;
    stopConnection: () => void;
    invoke: (methodName: string, ...args: any[]) => void;
    addHandler: (methodName: string, method: (...args: any[]) => void) => void;
    removeHandler: (methodName: string) => void;
    userConnectionId: string | null;
    setUserConnectionId: React.Dispatch<React.SetStateAction<string | null>>;
}

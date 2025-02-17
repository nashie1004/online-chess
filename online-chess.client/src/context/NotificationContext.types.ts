import { customMessageType, ICustomMesage } from "../game/utilities/types";

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
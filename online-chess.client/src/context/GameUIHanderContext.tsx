import { createContext, useReducer, useState } from "react"
import { baseNotificationState } from "../game/utilities/constants";
import { IBaseContextProps } from "../types/global";
import { INotificationContext, INotificationContextReducerState, INotificationContextReducerActions } from "./types";

export const gameUIHandlerContext = createContext<INotificationContext | null>(null);

function reducerFn(state: INotificationContextReducerState, action: INotificationContextReducerActions){
    switch(action.type){
        case "SET_ROOMKEY":
            return { ...state, roomKey: action.payload };
        case "SET_ASOFDATE":
            return { ...state, asOfDate: action.payload };
        case "SET_SIGNALRCONNECTIONDISCONNECTED":
            return { ...state, signalRConnectionDisconnected: action.payload };
        case "SET_HASAGAMEQUEUINGROOMKEY":
            return { ...state, hasAGameQueuing: action.payload };
        case "SET_HASAGAMEONGOING":
            return { ...state, hasAGameOnGoing: action.payload };
        case "SET_CUSTOMMESSAGE":
            return {  ...state, customMessage: action.payload.customMessage, customMessageType: action.payload.customMessageType }
        case "SET_RESETNOTIFICATIONS":
            return baseNotificationState;
        default:
            return state;
    }
}

export default function GameUIHandlerContext(
    { children }: IBaseContextProps
){
    // TODO 3/8/2025
    const [a,aa] = useState("custom game over modal screen text here");
    const [notificationState, setNotificationState] = useReducer<React.Reducer<INotificationContextReducerState, INotificationContextReducerActions>>(reducerFn, baseNotificationState);

    return <gameUIHandlerContext.Provider value={{
        notificationState, setNotificationState
    }}>
        {children}
    </gameUIHandlerContext.Provider>
}1
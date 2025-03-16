import { act, createContext, useReducer } from "react"
import { baseNotificationState } from "../game/utilities/constants";
import { IBaseContextProps } from "../types/global";
import { INotificationContext, INotificationContextReducerState, INotificationContextReducerActions } from "./types";

export const notificationContext = createContext<INotificationContext | null>(null);

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
        case "SET_HASMULTIPLETABSOPENED":
            console.log(action.payload)
            return { ...state, hasMultipleTabsOpened: action.payload };
        case "SET_RESETNOTIFICATIONS":
            return baseNotificationState;
        default:
            return state;
    }
}

export default function NotificationContext(
    { children }: IBaseContextProps
){
    const [notificationState, setNotificationState] = useReducer<React.Reducer<INotificationContextReducerState, INotificationContextReducerActions>>(reducerFn, baseNotificationState);

    return <notificationContext.Provider value={{
        notificationState, setNotificationState
    }}>
        {children}
    </notificationContext.Provider>
}1
import { createContext, useReducer } from "react"
import { baseNotificationState } from "../game/utilities/constants";
import { IBaseContextProps } from "../types/global";
import { INotificationContext, INotificationContextReducerState, INotificationContextReducerActions } from "./types";
import useLocalStorage from "../hooks/useLocalStorage";

export const userPreferenceContext = createContext<INotificationContext | null>(null);

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

// TODO 3/8/2025
export default function UserPreferenceContext(
    { children }: IBaseContextProps
){
  const { setValue: setBoard, data: board } = useLocalStorage("board", "green.png");
  const { setValue: setPiece, data: piece } = useLocalStorage("piece", "cburnett");
  const { setValue: setSound, data: sound } = useLocalStorage("sound", "TODO");
    const [notificationState, setNotificationState] = useReducer<React.Reducer<INotificationContextReducerState, INotificationContextReducerActions>>(reducerFn, baseNotificationState);

    return <userPreferenceContext.Provider value={{
        notificationState, setNotificationState
    }}>
        {children}
    </userPreferenceContext.Provider>
}1
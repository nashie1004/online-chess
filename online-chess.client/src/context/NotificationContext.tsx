import { createContext, useReducer } from "react"
import { INotificationContext, INotificationContextReducerActions, INotificationContextReducerState } from "../game/utilities/types";
import { baseNotificationState } from "../game/utilities/constants";

export const notificationContext = createContext<INotificationContext | null>(null);

function reducerFn(state: INotificationContextReducerState, action: INotificationContextReducerActions){
    switch(action.type){
        case "SET_ROOMKEY":
            return { ...state, roomKey: action.payload };
        case "SET_ASOFDATE":
            return { ...state, asOfDate: action.payload };
        case "SET_HASAGAMEQUEUING":
            return { ...state, hasAGameQueuing: action.payload };
        case "SET_HASAGAMEDISCONNECTED":
            return { ...state, hasAGameDisconnected: action.payload };
        case "SET_HASAGAMEONGOING":
            return { ...state, hasAGameOnGoing: action.payload };
        default:
            return state;
    }
}

interface INotificationContextProps {
    children: React.ReactNode;
}

export default function NotificationContext(
    { children }: INotificationContextProps
){
    const [notificationState, setNotificationState] = useReducer<React.Reducer<INotificationContextReducerState, INotificationContextReducerActions>>(reducerFn, baseNotificationState);

    return <notificationContext.Provider value={{
        notificationState, setNotificationState
    }}>
        {children}
    </notificationContext.Provider>
}1
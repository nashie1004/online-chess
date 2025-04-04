import { createContext, useState } from 'react'
import { HttpTransportType, HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import useNotificationContext from '../hooks/useNotificationContext';
import { MAIN_PAGE_HANDLERS } from '../constants/handlers';
import { IBaseContextProps } from '../types/global';
import { ISignalRContext } from './types';

export const signalRContext = createContext<null | ISignalRContext>(null);

let hubConnection: HubConnection;       

export default function SignalRContext(
    {children}: IBaseContextProps
) {
    const [userConnectionId, setUserConnectionId] = useState<string | null>(null);
    const { setNotificationState } = useNotificationContext();
    // let hubConnection: (HubConnection | undefined) = useMemo(() => undefined, [userConnectionId]);

    async function startConnection(){
        // setNotificationState({ 
        //     type: "SET_CUSTOMMESSAGE", payload: {
        //         customMessage: "Connecting...", customMessageType: "INFO"
        //     } 
        // });
        let connected = false;
        const URL = import.meta.env.VITE_API_URL + "/hub"

        hubConnection = new HubConnectionBuilder()
            .configureLogging(LogLevel.Critical) 
            .withUrl(URL, {
                // force
                skipNegotiation: true,  
                transport: HttpTransportType.WebSockets
            })
            .build();
        
        try {
            await hubConnection.start();

            hubConnection.onreconnected((e) => console.info(`Reconnected: ${e}`))
            hubConnection.onreconnecting((e) => console.info(`Reconnecting: ${e}`))
            hubConnection.onclose(() => {
                setNotificationState({ type: "SET_SIGNALRCONNECTIONDISCONNECTED", payload: true });
                setUserConnectionId(null);
            });

            connected = true;
        } catch (error) {
            setUserConnectionId(null);
            removeHandler(MAIN_PAGE_HANDLERS.ON_GET_USER_CONNECTION_ID);
            connected = false;
        }
        
        // setNotificationState({ 
        //     type: "SET_CUSTOMMESSAGE", payload: {
        //         customMessage: null, customMessageType: "INFO"
        //     } 
        // });
        setNotificationState({ type: "SET_SIGNALRCONNECTIONDISCONNECTED", payload: !connected });
        return connected;
    }

    async function stopConnection(){
        if (!hubConnection) return;
        if (hubConnection.state !== HubConnectionState.Connected){
            return;
        }

        removeHandler(MAIN_PAGE_HANDLERS.ON_GET_USER_CONNECTION_ID);

        try{
            setUserConnectionId(null);
            await hubConnection.stop();
        } catch(err){
            //console.log(`Stop connection error ${err}`)
        }
    }
    
    async function invoke(methodName: string, ...arg: any) {
        if (!hubConnection) return;
        if (hubConnection.state !== HubConnectionState.Connected){
            return;
        }
        
        try{
            await hubConnection.invoke(methodName, ...arg)
        } catch(err){
            //console.log(`Invoke error ${err}`)
        }
    }
    
    async function addHandler(methodName: string, method: (...args: any[]) => any){
        if (!hubConnection) return;
        if (hubConnection.state !== HubConnectionState.Connected){
            return;
        }

        try{
            await hubConnection.on(methodName, method);
        } catch(err){
            //console.log(`Add Handler ${err}`)
        }
    }

    function removeHandler(methodName: string){
        if (!hubConnection) return;
        
        hubConnection.off(methodName);
    }

  return (
    <signalRContext.Provider value={{
        addHandler, invoke, removeHandler
        , userConnectionId, stopConnection, startConnection
        , setUserConnectionId
    }}>
        {children}
    </signalRContext.Provider>
  )
}

import { createContext, ReactNode, useMemo, useState } from 'react'
import { ISignalRContext } from '../game/utilities/types';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { mainPageHandlers } from '../game/utilities/constants';
import useNotificationContext from '../hooks/useNotificationContext';

interface ISignalRContextProps{
    children: ReactNode
}

export const signalRContext = createContext<null | ISignalRContext>(null);

let hubConnection: HubConnection;       

export default function SignalRContext(
    {children}: ISignalRContextProps
) {
    const [userConnectionId, setUserConnectionId] = useState<string | null>(null);
    const { setNotificationState } = useNotificationContext();
    // let hubConnection: (HubConnection | undefined) = useMemo(() => undefined, [userConnectionId]);

    async function startConnection(){
        let connected = false;

        hubConnection = new HubConnectionBuilder()
            .configureLogging(LogLevel.Information) 
            .withUrl("https://localhost:44332/hub", {
                //skipNegotiation: true,  // skipNegotiation as we specify WebSockets
                //transport: HttpTransportType.WebSockets  // force WebSocket transport
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
            console.error(error);
            removeHandler(mainPageHandlers.onGetUserConnectionId);
            
            connected = false;
        }

        setNotificationState({ type: "SET_SIGNALRCONNECTIONDISCONNECTED", payload: !connected });
        return connected;
    }

    async function stopConnection(){
        if (!hubConnection) return;

        removeHandler(mainPageHandlers.onGetUserConnectionId);

        try{
            setUserConnectionId(null);
            await hubConnection.stop();
        } catch(err){
            console.log(`Stop connection error ${err}`)
        }
    }
    
    async function invoke(methodName: string, ...arg: any) {
        if (!hubConnection) return;
        
        try{
            await hubConnection.invoke(methodName, ...arg)
        } catch(err){
            console.log(`Invoke error ${err}`)
        }
    }
    
    async function addHandler(methodName: string, method: (...args: any[]) => any){
        if (!hubConnection) return;
        try{
            await hubConnection.on(methodName, method);
        } catch(err){
            console.log(`Add Handler ${err}`)
        }
    }

    function removeHandler(methodName: string){
        if (!hubConnection) return;
        
        hubConnection.off(methodName);
    }

    /*
    useEffect(() => {
        console.log("signalr context ", isAuthenticating, userConnectionId)

        if (isAuthenticating) return;
        if (userConnectionId) return;

        startConnection();

        return () => {
            stopConnection();
        }
    }, [isAuthenticating])
    */

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

import { createContext, ReactNode, useEffect, useState } from 'react'
import { ISignalRContext } from '../game/utilities/types';
import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

interface ISignalRContextProps{
    children: ReactNode
}

export const signalRContext = createContext<null | ISignalRContext>(null);
let hubConnection: HubConnection;

export default function SignalRContext(
    {children}: ISignalRContextProps
) {
    const [isConnected, setIsConnected] = useState(false);

    async function startConnection(){
        hubConnection = new HubConnectionBuilder()
            .configureLogging(LogLevel.Information) 
            .withUrl("https://localhost:44332/hub", {
                skipNegotiation: true,  // skipNegotiation as we specify WebSockets
                transport: HttpTransportType.WebSockets  // force WebSocket transport
            })
            .build();
        
        try {
            await hubConnection.start();
            //hubConnection.onclose(closeEventCallback);
            hubConnection.onreconnected((e) => console.info(`Reconnected: ${e}`))
            hubConnection.onreconnecting((e) => console.info(`Reconnecting: ${e}`))
            console.log("Connection started");
            setIsConnected(true);
        } catch (error) {
            console.error(error);
        }
    }

    async function stopConnection(){
        if (!hubConnection) return;

        try{
            setIsConnected(false);
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
        hubConnection.off(methodName);
    }

    useEffect(() => {
        if (!isConnected){
            startConnection();
        }

        return () => {
            stopConnection();
        }
    }, [])

  return (
    <signalRContext.Provider value={{
        addHandler, invoke, removeHandler, isConnected
    }}>
        {children}
    </signalRContext.Provider>
  )
}

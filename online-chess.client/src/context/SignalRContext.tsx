import { createContext, ReactNode, useEffect, useState } from 'react'
import { ISignalRContext } from '../game/utilities/types';
import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

interface ISignalRContextProps{
    children: ReactNode
}

export const signalRContext = createContext<null | ISignalRContext>(null);
// const signalRConnection = new SignalRConnection(); 

export default function SignalRContext(
    {children}: ISignalRContextProps
) {
    const [hubConnection, setHubConnection] = useState<HubConnection | null>(null);

    async function startConnection(closeEventCallback: (arg: any) => void){
        const connection = new HubConnectionBuilder()
            .configureLogging(LogLevel.Information) 
            .withUrl("https://localhost:44332/hub", {
                skipNegotiation: true,  // skipNegotiation as we specify WebSockets
                transport: HttpTransportType.WebSockets  // force WebSocket transport
            })
            .build();
        
        try {
            await connection.start();
            console.log("Connection started");
        } catch (error) {
            console.error(error);
        }

        connection.onclose(closeEventCallback);
        connection.onreconnected((e) => console.info(`Reconnected: ${e}`))
        connection.onreconnecting((e) => console.info(`Reconnecting: ${e}`))

        setHubConnection(connection);
    }

    async function stopConnection(){
        if (!hubConnection) return;

        try{
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
        console.log(hubConnection, methodName)

        if (!hubConnection) return;
        try{
            await hubConnection.on(methodName, method);
        } catch(err){
            console.log(`Add Handler ${err}`)
        }
    }

    useEffect(() => {

    }, [])

  return (
    <signalRContext.Provider value={{
        startConnection, stopConnection, addHandler, invoke
    }}>
        {children}
    </signalRContext.Provider>
  )
}

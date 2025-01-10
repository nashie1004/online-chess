import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

export default class SignalRConnection {

    private hubConnection: HubConnection | null;

    constructor() {
        this.hubConnection = null;
    }

    async startConnection(closeEventCallback: (arg: any) => void) {
        /*
        this.hubConnection = new HubConnectionBuilder()
            .withUrl("https://localhost:44332/hub")
            .configureLogging(LogLevel.Information)
            .build();
        ;
        */
        this.hubConnection = new HubConnectionBuilder()
            .configureLogging(LogLevel.Information)  // add this for diagnostic clues
            .withUrl("https://localhost:44332/hub", {
                skipNegotiation: true,  // skipNegotiation as we specify WebSockets
                transport: HttpTransportType.WebSockets  // force WebSocket transport
            })
            .build();

        console.log(this.hubConnection.connectionId)

        try {
            await this.hubConnection.start();
            console.log("Connection started");
        } catch (error) {
            console.error(error);
        }

        this.hubConnection.onclose(closeEventCallback);
        this.hubConnection.onreconnected((e) => console.info(`Reconnected: ${e}`))
        this.hubConnection.onreconnecting((e) => console.info(`Reconnecting: ${e}`))
    }

    async stopConnection() {
        if (!this.hubConnection) return;

        try{
            await this.hubConnection.stop();
        } catch(err){
            console.log(`Stop connection error ${err}`)
        }
    }


    async invoke(methodName: string, ...arg: any) {
        if (!this.hubConnection) return;
        
        try{
            await this.hubConnection.invoke(methodName, ...arg)
        } catch(err){
            console.log(`Invoke error ${err}`)
        }
    }

    async addHandler(methodName: string, method: (...args: any[]) => any){
        if (!this.hubConnection) return;

        
        try{
            await this.hubConnection.on(methodName, method);
        } catch(err){
            console.log(`Add Handler ${err}`)
        }
    }
}
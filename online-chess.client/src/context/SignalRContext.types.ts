export interface ISignalRContext {
    startConnection: () => Promise<boolean>;
    stopConnection: () => void;
    invoke: (methodName: string, ...args: any[]) => void;
    addHandler: (methodName: string, method: (...args: any[]) => void) => void;
    removeHandler: (methodName: string) => void;
    userConnectionId: string | null;
    setUserConnectionId: React.Dispatch<React.SetStateAction<string | null>>;
}

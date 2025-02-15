import { useState, useEffect, createContext } from 'react'
import BaseApiService from '../services/BaseApiService';
import { IUser } from '../game/utilities/types';
import useSignalRContext from '../hooks/useSignalRContext';
import { mainPageHandlers, mainPageInvokers } from '../game/utilities/constants';
import useNotificationContext from '../hooks/useNotificationContext';
import { useNavigate } from 'react-router';

interface IAuthContext {
    isAuthenticating: boolean;
    login: (user: IUser) => void;
    logout: () => void;
    user: IUser | null;
    setUserName: (val: string) => void;
}

interface IAuthContextProps {
    children: React.ReactNode;
}

export const authContext = createContext<IAuthContext>({
    isAuthenticating: true,
    login: () => { },
    logout: () => { },
    user: null,
    setUserName: () => {}
});

const authService = new BaseApiService();

export default function AuthContext(
    { children }: IAuthContextProps
) {
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const [user, setUser] = useState<null | IUser>(null);
    const {  setNotificationState } = useNotificationContext();
    const { 
        startConnection, stopConnection, userConnectionId
        , addHandler, invoke, setUserConnectionId, removeHandler
    } = useSignalRContext();
    const navigate = useNavigate();

    async function login(user: IUser) {
        setUser(user);
    }

    async function logout() {
        setIsAuthenticating(true);
        const res = await authService.basePost("/api/Auth/logout", {});
        if (res.isOk) {
            setUser(null);
        }

        setIsAuthenticating(false);
    }

    function setUserName(userName: string){
        setUser(prev => {
            if (!prev) return prev;
            return ({ ...prev, userName })
        }); 
    }

    useEffect(() => {
        // if (userConnectionId) {
        //     setNotificationState({ type: "SET_SIGNALRCONNECTIONDISCONNECTED", payload: false });
        //     return;
        // }
        
        async function checkIfSignedIn() {
            const res = await authService.baseGet("/api/Auth/isSignedIn");
            
            if (res.status === 404){
                navigate("/login");
            } else {
                setUser({ userName: res.data.userName, profileURL: "" });
            }
            
            setIsAuthenticating(false);
        }

        async function connectToSignalR(){
            const connected = await startConnection();

            setNotificationState({ type: "SET_SIGNALRCONNECTIONDISCONNECTED", payload: !connected });

            if (!connected) return;

            await addHandler(mainPageHandlers.onGetUserConnectionId, (connectionId) => {
                setUserConnectionId(connectionId);
            });

            await invoke(mainPageInvokers.getConnectionId);
        }

        checkIfSignedIn();
        connectToSignalR();

        return () => {
            removeHandler(mainPageHandlers.onGetUserConnectionId);
            stopConnection();
        }
    }, []);

    const data = {
        user, login, logout
        , isAuthenticating, setUserName
    };

  return (
      <authContext.Provider value={data}>
          {children}
      </authContext.Provider>
  )
}

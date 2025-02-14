import { useState, useEffect, createContext } from 'react'
import BaseApiService, { GenericReturnMessage } from '../services/BaseApiService';
import { IUser } from '../game/utilities/types';
import useSignalRContext from '../hooks/useSignalRContext';
import { authHandlers, authInvokers } from '../game/utilities/constants';
import { toast } from 'react-toastify';
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
    const { 
        startConnection, stopConnection, userConnectionId
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
        async function init() {
            const res = await authService.baseGet("/api/Auth/isSignedIn");
            
            if (res.status === 404){
                navigate("/login");
                // toast(res.message, { type: "error" })
            } else {
                setUser({ userName: res.data.userName, profileURL: "" });
            }
            
            setIsAuthenticating(false);
            
            if (userConnectionId) return;

            await startConnection();
        }

        init();

        return () => {
            stopConnection();
        };
    }, [userConnectionId])

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

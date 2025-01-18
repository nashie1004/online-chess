import { useState, useEffect, createContext } from 'react'
import BaseApiService from '../services/BaseApiService';
import { IUser } from '../game/utilities/types';


const authService = new BaseApiService();

interface IAuthContext {
    isAuthenticating: boolean;
    login: (user: IUser) => void;
    logout: () => void;
    user: IUser | null;
    setUserConnectionId: (val: string | null) => void;
    setUserName: (val: string) => void;
}

interface IAuthContextProps {
    children: React.ReactNode;
}

export const authContext = createContext<IAuthContext>({
    isAuthenticating: true,
    login: (user: IUser) => { },
    logout: () => { },
    user: null,
    setUserConnectionId: () => {},
    setUserName: () => {}
});

export default function AuthContext(
    { children }: IAuthContextProps
) {
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const [user, setUser] = useState<null | IUser>(null)

    async function login(user: IUser) {
        setUser(user);
    }

    async function logout() {
        setIsAuthenticating(true)
        const res = await authService.basePost("/api/Auth/logout", {});
        if (res.isOk) {
            setUser(null);
        }

        setIsAuthenticating(false)
    }

    function setUserConnectionId(connectionId: string | null){
        setUser(prev => {
            if (!prev) return prev;
            return ({ ...prev, connectionId })
        });
    }

    function setUserName(userName: string){
        setUser(prev => {
            if (!prev) return prev;
            return ({ ...prev, userName })
        }); 
    }

    useEffect(() => {
        async function authenticate() {
            const res = await authService.baseGet("/api/Auth/isSignedIn");
            if (res.isOk) {
                setUser({ userName: res.data.userName, connectionId: null })
            }
            setIsAuthenticating(false)
        }

        authenticate();

    }, [])

    const data = {
        user, login, logout, isAuthenticating, setUserConnectionId, setUserName
    }

  return (
      <authContext.Provider value={data}>
          {children}
      </authContext.Provider>
  )
}

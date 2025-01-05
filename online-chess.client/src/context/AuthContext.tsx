import { useState, useEffect, createContext } from 'react'
import BaseApiService from '../services/BaseApiService';


const authService = new BaseApiService();

interface IUser {
    userName: string;
}

interface IAuthContext {
    isAuthenticating: boolean;
    login: (user: IUser) => void;
    logout: () => void;
    user: IUser | null;
}

interface IAuthContextProps {
    children: React.ReactNode;
}

export const authContext = createContext<IAuthContext>({
    isAuthenticating: true,
    login: (user: IUser) => { },
    logout: () => { },
    user: null
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

    useEffect(() => {
        async function authenticate() {
            const res = await authService.baseGet("/api/Auth/isSignedIn");
            if (res.isOk) {
                setUser({ userName: res.data.userName })
            }
            setIsAuthenticating(false)
        }

        authenticate();

    }, [])

    const data = {
        user, login, logout, isAuthenticating
    }

  return (
      <authContext.Provider value={data}>
          {children}
      </authContext.Provider>
  )
}

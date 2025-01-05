import { useState, useEffect, createContext } from 'react'
import BaseApiService from '../services/BaseApiService';


const authService = new BaseApiService();

interface IAuthContext {
    isAuthenticated: boolean;
    isAuthenticating: boolean;
    login: () => void;
    logout: () => void;
}

interface IAuthContextProps {
    children: React.ReactNode;
}

export const authContext = createContext<IAuthContext>({
    isAuthenticated: false,
    isAuthenticating: true,
    login: () => { },
    logout: () => { },
});

export default function AuthContext(
    { children }: IAuthContextProps
) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    async function login() {
        setIsAuthenticated(true);
    }

    async function logout() {
        setIsAuthenticated(false);
    }

    useEffect(() => {
        async function authenticate() {
            const res = await authService.baseGet("/api/Auth/isSignedIn");
            if (res.isOk) {
                setIsAuthenticated(true);
            }
            console.log("res", res)

            setIsAuthenticating(false)
        }

        authenticate();

    }, [isAuthenticated])

    const data = {
        isAuthenticated, login, logout, isAuthenticating
    }

  return (
      <authContext.Provider value={data}>
          {children}
      </authContext.Provider>
  )
}

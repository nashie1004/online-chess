import { useState, createContext } from 'react'
import BaseApiService from '../services/BaseApiService';
import { IUser } from '../game/utilities/types';
import { IBaseContextProps } from '../types/global';
import { IAuthContext } from './types';

export const authContext = createContext<IAuthContext | null>(null);

const authService = new BaseApiService();

export default function AuthContext(
    { children }: IBaseContextProps
) {
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const [user, setUser] = useState<null | IUser>(null);

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

    const data = {
        user, login, logout
        , isAuthenticating, setUser
        , setIsAuthenticating
    };

  return (
      <authContext.Provider value={data}>
          {children}
      </authContext.Provider>
  )
}

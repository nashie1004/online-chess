import { IUser } from "../game/utilities/types";

export interface IAuthContext {
    isAuthenticating: boolean;
    setIsAuthenticating: React.Dispatch<React.SetStateAction<boolean>>;
    user: IUser | null;
    setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
    login: (user: IUser) => void;
    logout: () => void;
}
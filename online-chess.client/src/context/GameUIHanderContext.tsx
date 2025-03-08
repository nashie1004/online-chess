import { createContext, useState } from "react"
import { IBaseContextProps } from "../types/global";
import { IGameUIChandlerContext } from "./types";

export const gameUIHandlerContext = createContext<IGameUIChandlerContext | null>(null);

export default function GameUIHandlerContext(
    { children }: IBaseContextProps
){
    const [showLoadingModal, setShowLoadingModal] = useState<boolean>(false);
    const [gameOverMessage, setGameOverMessage] = useState<string>("");

    return <gameUIHandlerContext.Provider value={{
        showLoadingModal, setShowLoadingModal
        ,gameOverMessage, setGameOverMessage
    }}>
        {children}
    </gameUIHandlerContext.Provider>
}1
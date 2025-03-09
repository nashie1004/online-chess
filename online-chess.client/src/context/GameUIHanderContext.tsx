import { createContext, useState } from "react"
import { IBaseContextProps } from "../types/global";
import { IGameUIChandlerContext } from "./types";

export const gameUIHandlerContext = createContext<IGameUIChandlerContext | null>(null);

export default function GameUIHandlerContext(
    { children }: IBaseContextProps
){
    const [showLoadingModal, setShowLoadingModal] = useState<boolean>(false);
    const [gameOverMessage, setGameOverMessage] = useState<string>("");
    const [showGameOverModal, setShowGameOverModal] = useState(false);

    return <gameUIHandlerContext.Provider value={{
        showLoadingModal, setShowLoadingModal
        ,gameOverMessage, setGameOverMessage
        ,showGameOverModal, setShowGameOverModal
    }}>
        {children}
    </gameUIHandlerContext.Provider>
}1
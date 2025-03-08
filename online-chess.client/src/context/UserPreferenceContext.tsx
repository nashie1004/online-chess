import { createContext } from "react"
import { IBaseContextProps } from "../types/global";
import useLocalStorage from "../hooks/useLocalStorage";
import { IUserPreferenceContext } from "./types";

export const userPreferenceContext = createContext<IUserPreferenceContext | null>(null);

export default function UserPreferenceContext(
    { children }: IBaseContextProps
){
  const { setValue: setBoard, data: boardUI } = useLocalStorage("board", "green.png");
  const { setValue: setPiece, data: pieceUI } = useLocalStorage("piece", "cburnett");
  const { setValue: setSound, data: soundFx } = useLocalStorage("sound", "TODO");

    return <userPreferenceContext.Provider value={{
        boardUI, setBoard
        ,pieceUI, setPiece
        ,soundFx, setSound
    }}>
        {children}
    </userPreferenceContext.Provider>
}1
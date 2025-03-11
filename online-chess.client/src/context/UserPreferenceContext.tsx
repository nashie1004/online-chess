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
  const { setValue: setSound, data: soundFx } = useLocalStorage("sound", "true");
  const { setValue: setShowCoords, data: showCoordsString } = useLocalStorage("showCoords", "true");

  const soundFx2 = soundFx === "true";
  const showCoords = showCoordsString === "true";

    return <userPreferenceContext.Provider value={{
        boardUI, setBoard
        ,pieceUI, setPiece
        ,soundFx, setSound
        ,showCoords, setShowCoords
    }}>
        {children}
    </userPreferenceContext.Provider>
}1
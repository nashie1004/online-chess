import { GameType } from "../game/utilities/constants";

export function gameTypeDisplay(gameType: GameType){
    switch(gameType){
        case GameType.Classical:
            return "Classical - 1 hr per player"
        case GameType.Blitz3Mins:
            return "Blitz - 3 minutes per player"
        case GameType.Blitz5Mins:
            return "Blitz - 5 minutes per player"
        case GameType.Rapid10Mins:
            return "Rapid - 10 minutes per player"
        case GameType.Rapid25Mins:
            return "Rapid - 25 minutes per player"
    }
}
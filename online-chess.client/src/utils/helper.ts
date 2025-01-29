import moment from "moment";
import { ColorOptions, GameStatus, GameType } from "../game/utilities/constants";

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

export function msToMinuteDisplay(milliseconds: number){
    let duration = moment.duration(milliseconds, 'milliseconds');
    let hours = duration.hours();
    let minutes = duration.minutes();
    let seconds = duration.seconds();
    let ms = duration.milliseconds();  // Extract the milliseconds

    let formattedHours = String(hours).padStart(2, '0');
    let formattedMinutes = String(minutes).padStart(2, '0');
    let formattedSeconds = String(seconds).padStart(2, '0');
    // let formattedMilliseconds = String(ms).padStart(1, '0'); // Ensure 3 digits for milliseconds

    // const retVal = `${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`; // Include milliseconds
    const retVal = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`; // Include milliseconds
    return retVal;
}

export function gameStatusDisplay(status: GameStatus){
    switch(status){
        case GameStatus.Won:
            return "Win";
        case GameStatus.Lose:
            return "Lose";
        case GameStatus.Draw:
            return "Draw";
    }
}

export function colorOptionsDisplay(option: ColorOptions){
    switch(option){
        case ColorOptions.White:
            return "White";
        case ColorOptions.Black:
            return "Black";
        case ColorOptions.Random:
            return "Random";
    }
}

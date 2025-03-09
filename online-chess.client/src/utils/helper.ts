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
    //let ms = duration.milliseconds();  // Extract the milliseconds

    let formattedHours = String(hours).padStart(2, '0');
    let formattedMinutes = String(minutes).padStart(2, '0');
    let formattedSeconds = String(seconds).padStart(2, '0');
    // let formattedMilliseconds = String(ms).padStart(1, '0'); // Ensure 3 digits for milliseconds

    // const retVal = `${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`; // Include milliseconds
    const retVal = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`; // Include milliseconds
    return retVal;
}

export function secondsToMinuteDisplay(seconds: number) {
    let duration = moment.duration(seconds, "seconds");
    
    // Get the minutes and seconds (ignoring hours and milliseconds)
    let minutes = duration.minutes();
    let secondsFormatted = duration.seconds();  // Extract seconds

    // Pad the minutes and seconds to always show two digits
    let formattedMinutes = String(minutes).padStart(2, '0');
    let formattedSeconds = String(secondsFormatted).padStart(2, '0');
    
    // Return formatted value as MM:SS
    const retVal = `${formattedMinutes}:${formattedSeconds}`;

    return retVal;
}

export function secondsToMinuteDisplay2(seconds: number) {
    const minutes = Math.floor(seconds / 60);  
    const remainingSeconds = seconds % 60;     

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    const retVal = `${formattedMinutes}:${formattedSeconds}`;
    
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

export function gameTypeToSeconds(gameType: GameType){
    let seconds = 0;
    switch(gameType){
        case GameType.Classical:
            seconds = 3600;
            break;
        case GameType.Blitz3Mins:
            seconds = 180;
            break;
        case GameType.Blitz5Mins:
            seconds = 300;
            break;
        case GameType.Rapid10Mins:
            seconds = 600;
            break;
        case GameType.Rapid25Mins:
            seconds = 1500;
            break;
    }
    return seconds;
}

export function setImage(profileImageUrl: string = ""){
    profileImageUrl = profileImageUrl === "" || !profileImageUrl ? "DefaultProfileImage.jpg" : profileImageUrl; 
    return `${import.meta.env.VITE_API_URL}/api/Play/get-image?FileName=${profileImageUrl}`
}
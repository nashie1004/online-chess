import { useEffect, useState } from 'react'
import useGameContext from '../../hooks/useGameContext';
import { gameTypeToSeconds, secondsToMinuteDisplay2, setImage } from '../../utils/helper';
import useSignalRContext from '../../hooks/useSignalRContext';
import { PLAY_PAGE_HANDLERS } from '../../constants/handlers';

export default function PlayerInfo() {
    const { gameState } = useGameContext();
    const [actualTime, setActualTime] = useState({ white: 0, black: 0, whitesTurn: true });
    const { addHandler, removeHandler } = useSignalRContext();

    const { myInfo, opponentInfo, gameType, gameStatus } = gameState;
    const playerIsWhite = myInfo.playerIsWhite;
    
    const white = myInfo.playerIsWhite ? myInfo : opponentInfo;
    const black = !opponentInfo.playerIsWhite ? opponentInfo : myInfo;

    useEffect(() => {
        setActualTime({ 
            white: gameTypeToSeconds(gameType), 
            black: gameTypeToSeconds(gameType), 
            whitesTurn: white.isPlayersTurn 
        });
        
    }, [gameStatus]);
   
    useEffect(() => {

        async function startTimer(){
            await addHandler(PLAY_PAGE_HANDLERS.ON_UPDATE_TIMER, (data: any) => {
                const white = data.white as number;
                const black = data.black as number;
                const whitesTurn = data.whitesTurn as boolean;

                setActualTime({ white, black, whitesTurn });
            });            
        }

        if (gameStatus === "ONGOING"){
            startTimer();
        }

        return () => {
            removeHandler(PLAY_PAGE_HANDLERS.ON_UPDATE_TIMER);
        };

    }, [gameStatus]);

  return (
    <>
        <div className="hstack my-3">
            <div className='timer-info w-100'>
                <h6 className='text-secondary'>{playerIsWhite ? "You" : opponentInfo.userName} (white)</h6>
                <img src={setImage()} className='profile-img small' alt="player-1-img" />
                <h2>
                    <i className="bi bi-clock" style={{ fontSize: "1.4rem" }}></i> <span>{secondsToMinuteDisplay2(actualTime.white)}s</span>
                </h2>
            </div>
            <div className='timer-info w-100'>
                <h6  className='text-secondary'>{!playerIsWhite ? "You" : opponentInfo.userName} (black)</h6>
                <img src={setImage()} className='profile-img small' alt="player-2-img" />
                <h2>
                    <i className="bi bi-clock" style={{ fontSize: "1.4rem" }}></i> <span>{secondsToMinuteDisplay2(actualTime.black)}s</span>
                </h2>
            </div>
        </div>
        <div className='game-alert'>
            {actualTime.whitesTurn && `White's turn to move.`}
            {!actualTime.whitesTurn && `Black's turn to move.`}
            {white.kingsState.isInCheck && ` White is in check.`}
            {black.kingsState.isInCheck && ` Black is in check.`}
            {white.kingsState.isCheckMate && ` White is checkmated.`}
            {black.kingsState.isCheckMate && ` Black is checkmated.`}
            {white.kingsState.isInStalemate || black.kingsState.isInStalemate && `Stalemate.` }
        </div>
    </>
  )
}

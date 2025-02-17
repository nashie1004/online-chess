import { useEffect, useState } from 'react'
import useGameContext from '../../hooks/useGameContext';
import { gameTypeToSeconds, secondsToMinuteDisplay2 } from '../../utils/helper';
import useSignalRContext from '../../hooks/useSignalRContext';
import { PLAY_PAGE_HANDLERS } from '../../constants/handlers';

export default function PlayerInfo() {
    const { gameState } = useGameContext();

    const [actualTime, setActualTime] = useState({ white: 0, black: 0, whitesTurn: true });
    const { addHandler, removeHandler } = useSignalRContext();

    const white = gameState.myInfo.playerIsWhite ? gameState.myInfo : gameState.opponentInfo;
    const black = !gameState.myInfo.playerIsWhite ? gameState.myInfo : gameState.opponentInfo;

    useEffect(() => {
        setActualTime({ 
            white: gameTypeToSeconds(gameState.gameType), 
            black: gameTypeToSeconds(gameState.gameType), 
            whitesTurn: true 
        });
    }, [gameState.gameType]);

    useEffect(() => {

        async function startTimer(){
            await addHandler(PLAY_PAGE_HANDLERS.ON_UPDATE_TIMER, (data: any) => {
                const white = data.white as number;
                const black = data.black as number;
                const whitesTurn = data.whitesTurn as boolean;

                setActualTime({ white, black, whitesTurn });
            });            
        }

        if (gameState.gameStatus === "ONGOING"){
            startTimer();
        }

        return () => {
            removeHandler(PLAY_PAGE_HANDLERS.ON_UPDATE_TIMER);
        };

    }, [gameState.gameStatus]);

  return (
    <>
        <div className="hstack my-3">
            <div className='timer-info w-100'>
                <h6 className='text-secondary'>{gameState.myInfo.playerIsWhite ? "You" : gameState.opponentInfo.userName} (white)</h6>
                <h2>
                    <i className="bi bi-clock" style={{ fontSize: "1.4rem" }}></i> <span>{secondsToMinuteDisplay2(actualTime.white)}s</span>
                </h2>
            </div>
            <div className='timer-info w-100'>
                <h6  className='text-secondary'>{!gameState.myInfo.playerIsWhite ? "You" : gameState.opponentInfo.userName} (black)</h6>
                <h2>
                    <i className="bi bi-clock" style={{ fontSize: "1.4rem" }}></i> <span>{secondsToMinuteDisplay2(actualTime.black)}s</span>
                </h2>
            </div>
        </div>
        <div className='game-alert'>
            {actualTime.whitesTurn ? <>White's</> : <>Black's</>} turn to move.
            {
                white.kingsState.isInCheck || black.kingsState.isInCheck ? <>
                    {white.kingsState.isInCheck ? " White is in check." : ""}
                    {black.kingsState.isInCheck ? " Black is in check." : ""}
                </> : <></> 
            }
            {
                white.kingsState.isCheckMate || black.kingsState.isCheckMate ? <>
                    {white.kingsState.isCheckMate ? " White is checkmated." : ""}
                    {black.kingsState.isCheckMate ? " Black is checkmated." : ""}
                </> : <></> 
            }
            {
                white.kingsState.isInStalemate || black.kingsState.isInStalemate ? <>
                Stalemate.
                </> : <></> 
            }
        </div>
    </>
  )
}

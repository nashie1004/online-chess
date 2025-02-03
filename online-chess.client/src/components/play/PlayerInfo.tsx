import { useEffect, useState } from 'react'
import useGameContext from '../../hooks/useGameContext';
import { msToMinuteDisplay } from '../../utils/helper';

export default function PlayerInfo() {
    const { gameState } = useGameContext();
    const [actualTime, setActualTime] = useState({ white: 0, black: 0, whitesTurn: false });

    const white = gameState.myInfo.playerIsWhite ? gameState.myInfo : gameState.opponentInfo;
    const black = !gameState.myInfo.playerIsWhite ? gameState.myInfo : gameState.opponentInfo;

    useEffect(() => {

        console.log(`white time left: ${white.timeLeft}, black time left: ${black.timeLeft}`)
        
        setActualTime({
            white: white.timeLeft
            , black: black.timeLeft
            , whitesTurn: gameState.myInfo.playerIsWhite ? gameState.myInfo.isPlayersTurn : gameState.opponentInfo.isPlayersTurn
        });

        let intervalId: number;

        if (actualTime.whitesTurn){
            intervalId = setInterval(() => {
                setActualTime(prev => ({ ...prev, white: prev.white - 100 }));
            }, 100)
        } else {
            intervalId = setInterval(() => {
                setActualTime(prev => ({ ...prev, black: prev.black - 100 }));
            }, 100)
        }

        return () => {
            clearInterval(intervalId);
        }
    }, [gameState.myInfo.isPlayersTurn, gameState.opponentInfo.isPlayersTurn])

  return (
    <>
        <div className="hstack my-3">
            <div className='timer-info w-100'>
                <h6 className='text-secondary'>Lorem, ipsum.</h6>
                <h2>
                    <i className="bi bi-clock"></i> <span>{msToMinuteDisplay(actualTime.white)}s</span>
                </h2>
            </div>
            <div className='timer-info w-100'>
                <h6  className='text-secondary'>Lorem, ipsum.</h6>
                <h2>
                    <i className="bi bi-clock"></i> <span>{msToMinuteDisplay(actualTime.black)}s</span>
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

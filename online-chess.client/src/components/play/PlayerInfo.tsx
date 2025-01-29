import { useEffect, useState } from 'react'
import useGameContext from '../../hooks/useGameContext';
import { msToMinuteDisplay } from '../../utils/helper';

export default function PlayerInfo() {
    const { gameState } = useGameContext();
    const [actualTime, setActualTime] = useState(gameState.timer);
    const kingsState = gameState.kingsState;

    useEffect(() => {
        
        setActualTime(gameState.timer);
        let intervalId: number;

        if (gameState.timer.isWhitesTurn){
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
        
    }, [gameState.timer])

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
            {actualTime.isWhitesTurn ? <>White's</> : <>Black's</>} turn to move.
            {
                kingsState.white.isInCheck || kingsState.black.isInCheck ? <>
                    {kingsState.white.isInCheck ? " White is in check." : ""}
                    {kingsState.black.isInCheck ? " Black is in check." : ""}
                </> : <></> 
            }
            {
                kingsState.white.isCheckMate || kingsState.black.isCheckMate ? <>
                    {kingsState.white.isCheckMate ? " White is checkmated." : ""}
                    {kingsState.black.isCheckMate ? " Black is checkmated." : ""}
                </> : <></> 
            }
            {
                kingsState.white.isInStalemate || kingsState.black.isInStalemate ? <>
                Stalemate.
                </> : <></> 
            }
        </div>
    </>
  )
}

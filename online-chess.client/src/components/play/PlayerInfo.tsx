import { useEffect, useState } from 'react'
import useGameContext from '../../hooks/useGameContext';
import usePhaserContext from '../../hooks/usePhaserContext';

export default function PlayerInfo() {
    const {timer, setTimer} = useGameContext();
    //const [timer, setTimer] = useState(0);

  const { kingsState } = usePhaserContext();
    
    useEffect(() => {
        
        let intervalId: number;

        if (timer.isWhitesTurn){
            intervalId = setInterval(() => {
                setTimer(prev => ({ ...prev, white: prev.white + .1 }));
            }, 100)
        } else {
            intervalId = setInterval(() => {
                setTimer(prev => ({ ...prev, black: prev.black + .1 }));
            }, 100)
        }

        return () => {
            clearInterval(intervalId);
        }
        
    }, [])

  return (
    <>
        <div className="hstack my-3">
            <div className='timer-info w-100'>
                <h6 className='text-secondary'>Lorem, ipsum.</h6>
                <h2>
                    <i className="bi bi-clock"></i> <span>{timer.white.toFixed(1)}s</span>
                </h2>
            </div>
            <div className='timer-info w-100'>
                <h6  className='text-secondary'>Lorem, ipsum.</h6>
                <h2>
                    <i className="bi bi-clock"></i> <span>{timer.black.toFixed(1)}s</span>
                </h2>
            </div>
        </div>
        <div className='game-alert'>
            {timer.isWhitesTurn ? <>White's</> : <>Black's</>} turn to move.
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

import { useEffect } from 'react'
import useReactContext from '../../hooks/useGameContext';
import usePhaserContext from '../../hooks/usePhaserContext';
import { Alert, Badge } from 'react-bootstrap';

export default function PlayerInfo() {
    const {timer, setTimer} = useReactContext();
  const {
        isWhitesTurn, kingsState
  } = usePhaserContext();
    
    
    useEffect(() => {
        /*
        let intervalId: number;

        if (isWhitesTurn){
            intervalId = setInterval(() => {
                setTimer(prev => ({ ...prev, white: prev.white + 1 }));
            }, 1000)
        } else {
            intervalId = setInterval(() => {
                setTimer(prev => ({ ...prev, black: prev.black + 1 }));
            }, 1000)
        }

        return () => {
            clearInterval(intervalId);
        }
        */
    }, [isWhitesTurn])

  return (
    <>
        <div className="hstack my-3">
            <div className='timer-info w-100'>
                <h6 className='text-secondary'>Lorem, ipsum.</h6>
                <h2>
                    <i className="bi bi-clock"></i> <span>{timer.white}.00s</span>
                </h2>
            </div>
            <div className='timer-info w-100'>
                <h6  className='text-secondary'>Lorem, ipsum.</h6>
                <h2>
                    <i className="bi bi-clock"></i> <span>{timer.black}.00s</span>
                </h2>
            </div>
        </div>
        <div className='game-alert'>
            {isWhitesTurn ? <>White's</> : <>Black's</>} turn to move.
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

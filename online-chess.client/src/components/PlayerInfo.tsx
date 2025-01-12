import { useEffect } from 'react'
import useReactContext from '../hooks/useGameContext';
import usePhaserContext from '../hooks/usePhaserContext';
import Image from 'react-bootstrap/Image';
import { Alert, Badge } from 'react-bootstrap';

export default function PlayerInfo() {
    const {timer, setTimer} = useReactContext();
  const {
        isWhitesTurn, kingsState
  } = usePhaserContext();
    
    
    useEffect(() => {
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
    }, [isWhitesTurn])

  return (
    <>
        <div className="row my-2">
            <div className='col'>
                <h6 className='text-secondary'>Lorem, ipsum.</h6>
                <h1>
                    <Badge bg="dark">{timer.white}.00s</Badge>
                </h1>
            </div>
            <div className='col'>
                <h6  className='text-secondary'>Lorem, ipsum.</h6>
                <h1>
                    <Badge bg="dark">{timer.black}.00s</Badge>
                </h1>
            </div>
        </div>
        <Alert variant='secondary'>
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
        </Alert>
    </>
  )
}

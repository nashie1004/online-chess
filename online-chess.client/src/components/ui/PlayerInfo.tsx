import { useEffect } from 'react'
import useReactContext from '../../hooks/useReactContext';
import usePhaser from '../../hooks/usePhaser';
import Image from 'react-bootstrap/Image';

export default function PlayerInfo() {
    const {timer, setTimer} = useReactContext();
  const {
        isWhitesTurn, kingsState
    } = usePhaser();
    
    
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
    <div className="row">
        {/* <div className='flex gap-2'>
            <Chip size="md">{isWhitesTurn ? <>White's</> : <>Black's</>} turn to move</Chip>
            {
                kingsState.white.isInCheck || kingsState.black.isInCheck ? <Chip size='md'>
                    {kingsState.white.isInCheck ? "White is in check" : ""}
                    {kingsState.black.isInCheck ? "Black is in check" : ""}
                </Chip> : <></> 
            }
            {
                kingsState.white.isCheckMate || kingsState.black.isCheckMate ? <Chip size='md'>
                    {kingsState.white.isCheckMate ? "White is checkmated" : ""}
                    {kingsState.black.isCheckMate ? "Black is checkmated" : ""}
                </Chip> : <></> 
            }
        </div> */}
        <div className='col'>
            <Image rounded style={{ height: 50, width: 50 }} />
            <h5>Player 1</h5>
            <p>{timer.white} second(s)</p>
            {isWhitesTurn ? <p>White's turn</p> : <></>}
        </div>
        <div className='col'>
            <h5>Player 2</h5>
            <p>{timer.black} second(s)</p>
            {!isWhitesTurn ? <p>Black's turn</p> : <></>}
        </div>
    </div>
  )
}

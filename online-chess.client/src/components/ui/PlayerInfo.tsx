import { Alert, Avatar, Chip, Kbd } from '@nextui-org/react';
import React, { useEffect } from 'react'
import useReactContext from '../../hooks/useReactContext';
import UserIcon from './UserIcon';
import usePhaser from '../../hooks/usePhaser';

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
    <div className="flex flex-col gap-4">
        <div className='flex gap-2'>
            <Chip size="md">{isWhitesTurn ? <>White's</> : <>Black's</>} turn to move</Chip>
            {
                kingsState.white.isInCheck || kingsState.black.isInCheck ? <Chip size='md'>
                    {kingsState.white.isInCheck ? "White is in check" : ""}
                    {kingsState.black.isInCheck ? "Black is in check" : ""}
                </Chip> : <></> 
            }
        </div>
        <Alert 
            icon={<UserIcon />}
            description
            endContent={
                <>
                    <p>{timer.white} second(s)</p>
                </>
            }
            variant={isWhitesTurn ? "solid" : "bordered"}
            title={"Player 1"}
        />
        <Alert 
            icon={<UserIcon />}
            description
            endContent={
                <>
                    <p>{timer.black} second(s)</p>
                </>
            }
            variant={!isWhitesTurn ? "solid" : "bordered"}
            title={"Player 2"}
        />
    </div>
  )
}

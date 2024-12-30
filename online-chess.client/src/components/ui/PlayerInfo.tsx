import { Alert, Avatar, Kbd } from '@nextui-org/react';
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
    <div className="flex gap-4 items-center">
        <Alert 
            icon={<UserIcon />}
            description
            endContent={
                <>
                    <p>{kingsState.white.isInCheck ? <>White is in check</> : <></>}</p>
                    <p>{isWhitesTurn ? "White" : "Black"}'s' turn</p>
                    <p>{timer.white} second(s)</p>
                </>
            }
            variant='solid'
            title={"Player 1"}
        />
        <Alert 
            icon={<UserIcon />}
            description
            endContent={
                <>
                    <p>{kingsState.black.isInCheck ? <>Black is in check</> : <></>}</p>
                    <p>{!isWhitesTurn ? "Black" : "White"}'s' turn</p>
                    <p>{timer.black} second(s)</p>
                </>
            }
            variant='solid'
            title={"Player 2"}
        />
    </div>
  )
}

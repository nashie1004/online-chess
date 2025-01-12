import { useContext } from 'react'
import { gameContext } from '../context/GameContext'

export default function useGameContext() {
  const reTVal = useContext(gameContext);
  if (!reTVal){
    throw new Error("no react context value")
  }
  return reTVal;
}

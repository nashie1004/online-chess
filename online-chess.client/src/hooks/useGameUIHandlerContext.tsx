import { useContext } from 'react'
import { gameUIHandlerContext } from '../context/GameUIHanderContext';

export default function useGameUIHandlerContext() {
  const reTVal = useContext(gameUIHandlerContext);
  if (!reTVal){
    throw new Error("no react context value")
  }
  return reTVal;
}

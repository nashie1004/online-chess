import { useContext } from 'react'
import { initializerContext } from '../context/InitializerContext';

export default function useInitializerContext() {
  const reTVal = useContext(initializerContext);
  if (!reTVal){
    throw new Error("no react context value")
  }
  return reTVal;
}

import { useContext } from 'react'
import { signalRContext } from '../context/SignalRContext';

export default function useSignalRContext() {
  const reTVal = useContext(signalRContext);
  if (!reTVal){
    throw new Error("no react context value")
  }
  return reTVal;
}

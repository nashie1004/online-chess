import { useContext } from 'react'
import { reactContext } from '../context/ReactContext'

export default function useReactContext() {
  const reTVal = useContext(reactContext);
  if (!reTVal){
    throw new Error("no react context value")
  }
  return reTVal;
}

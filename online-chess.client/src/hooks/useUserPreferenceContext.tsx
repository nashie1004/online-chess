import { useContext } from 'react'
import { userPreferenceContext } from '../context/UserPreferenceContext';

export default function useUserPreferenceContext() {
  const reTVal = useContext(userPreferenceContext);
  if (!reTVal){
    throw new Error("no react context value")
  }
  return reTVal;
}

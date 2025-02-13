import { useContext } from 'react'
import { notificationContext } from '../context/NotificationContext';

export default function useNotificationContext() {
  const reTVal = useContext(notificationContext);
  if (!reTVal){
    throw new Error("no react context value")
  }
  return reTVal;
}

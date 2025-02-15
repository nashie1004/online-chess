import React, { createContext, useEffect, useMemo } from 'react'
import { IInitializerContext } from '../game/utilities/types';
import useNotificationContext from '../hooks/useNotificationContext';
import useSignalRContext from '../hooks/useSignalRContext';
import useAuthContext from '../hooks/useAuthContext';
import BaseApiService from '../services/BaseApiService';
import { useNavigate } from 'react-router';
import { mainPageHandlers, mainPageInvokers } from '../game/utilities/constants';

export const initializerContext = createContext<IInitializerContext | null>(null);

interface IInitializerContextProps{
  children: React.ReactNode;
}

export default function InitializerContext(
  { children } : IInitializerContextProps
) {
  const { setNotificationState } = useNotificationContext();
  const { 
    startConnection, stopConnection, addHandler
    , setUserConnectionId, invoke, removeHandler
  } = useSignalRContext();
  const { setUser, setIsAuthenticating } = useAuthContext();
  const navigate = useNavigate();

  const authService = useMemo(() => new BaseApiService(), []);
  
  async function checkIfSignedIn() {
    const res = await authService.baseGet("/api/Auth/isSignedIn");
    
    if (res.status === 404){
        //navigate("/login");
    } else {
        setUser({ userName: res.data.userName, profileURL: "" });
    }
    
    setIsAuthenticating(false);
  }

  async function connectToSignalR(){
    const connected = await startConnection();

    setNotificationState({ type: "SET_SIGNALRCONNECTIONDISCONNECTED", payload: !connected });

    if (!connected) return;

    await addHandler(mainPageHandlers.onGetUserConnectionId, (connectionId) => {
        setUserConnectionId(connectionId);
    });

    await invoke(mainPageInvokers.getConnectionId);
  }

  useEffect(() => {
    // if (userConnectionId) {
    //     setNotificationState({ type: "SET_SIGNALRCONNECTIONDISCONNECTED", payload: false });
    //     return;
    // }
    
    checkIfSignedIn();
    connectToSignalR();

    return () => {
      removeHandler(mainPageHandlers.onGetUserConnectionId);
      stopConnection();
    }
  }, []);

  return (
    <initializerContext.Provider value={{}}>
      {children}
    </initializerContext.Provider>
  )
}

import React, { createContext, useEffect, useMemo, useState } from 'react'
import { IInitializerContext } from '../game/utilities/types';
import useNotificationContext from '../hooks/useNotificationContext';
import useSignalRContext from '../hooks/useSignalRContext';
import useAuthContext from '../hooks/useAuthContext';
import BaseApiService from '../services/BaseApiService';
import { useLocation, useNavigate } from 'react-router';
import { lobbyPageHandlers, mainPageHandlers, mainPageInvokers } from '../game/utilities/constants';
import useQueuingContext from '../hooks/useQueuingContext';
import useGameContext from '../hooks/useGameContext';

export const initializerContext = createContext<IInitializerContext | null>(null);

interface IInitializerContextProps{
  children: React.ReactNode;
}

export default function InitializerContext(
  { children } : IInitializerContextProps
) {
  const { setNotificationState, notificationState } = useNotificationContext();
  const { 
    startConnection, stopConnection, addHandler
    , setUserConnectionId, invoke, removeHandler
  } = useSignalRContext();
  const { setUser, setIsAuthenticating, user } = useAuthContext();
  const { setQueuingRoomKey } = useQueuingContext();
  const navigate = useNavigate();
  const [initialize, setInitialize] = useState<boolean>(true);
  const url = useLocation();
  const { setGameState } = useGameContext();

  // if not signed in, allowed urls are these
  const unAuthenticatedAllowedPaths = useMemo(() => ["/", "/about", "/register", "/login"], []);
  const authService = useMemo(() => new BaseApiService(), []);

  async function checkIfSignedIn() {
    const res = await authService.baseGet("/api/Auth/isSignedIn");
    
    if (res.status === 200){
      setUser({ userName: res.data.userName, profileURL: "" });
    }
    
    setIsAuthenticating(false);
  }

  async function addHandlers(){
    await addHandler(mainPageHandlers.onGetUserConnectionId, (connectionId: string) => {
      setUserConnectionId(connectionId);
    });
    await addHandler(mainPageHandlers.onGenericError, (msg: string) => {
      setNotificationState({ 
        type: "SET_CUSTOMMESSAGE"
        , payload: { customMessage: msg, customMessageType: "DANGER" } 
      });
    });
    await addHandler(lobbyPageHandlers.onGetRoomKey, (roomKey: string) => {
      setNotificationState({ type: "SET_HASAGAMEQUEUINGROOMKEY", payload: true });
      setQueuingRoomKey(roomKey);
    });
    await addHandler(lobbyPageHandlers.onMatchFound, (roomKey: string) => {
      navigate(`/play/${roomKey}`);
    });
    await addHandler(mainPageHandlers.onHasAGameInProgress, (roomKey: string) => {
      // const inPlagePage = url.pathname.startsWith("/play/")
      // console.log("TODO onHasAGameInProgress: ", roomKey, inPlagePage, url)
      setGameState({ type: "SET_GAMEROOMKEY", payload: roomKey });
      setNotificationState({ type: "SET_HASAGAMEONGOING", payload: true });
    });
    
    await invoke(mainPageInvokers.getConnectionId);
    await invoke(mainPageInvokers.getHasAGameInProgress);
  }

  /**
   * Handles on page change event
   */
  useEffect(() => {
    if (user) return;

    if (notificationState.customMessage){
      setNotificationState({ type: "SET_RESETNOTIFICATIONS" });
    }

    if (!unAuthenticatedAllowedPaths.includes(url.pathname)) {
      navigate('/login');
      return;
    }

  }, [user, url.pathname]);

  /**
   * This is the actual initializer of our app
   */
  useEffect(() => {
    
    async function init(){
      // 0. clear state
      setInitialize(false);
      setNotificationState({ type: "SET_RESETNOTIFICATIONS" });

      // 1. check if signed in
      await checkIfSignedIn();

      // 2. connect to signalr
      const connected = await startConnection();
      if (!connected) return;

      // 3. add handlers and invoke
      await addHandlers();
    }

    if (initialize){
      init();
    }

    return () => {
      removeHandler(mainPageHandlers.onGetUserConnectionId);
      removeHandler(lobbyPageHandlers.onGetRoomKey);
      removeHandler(lobbyPageHandlers.onMatchFound);
      removeHandler(mainPageHandlers.onHasAGameInProgress);
      removeHandler(mainPageHandlers.onGenericError);
      stopConnection();
    }
  }, [initialize]);

  return (
    <initializerContext.Provider value={{
      setInitialize
    }}>
      {children}
    </initializerContext.Provider>
  )
}

import { createContext, useEffect, useMemo, useState } from 'react'
import useNotificationContext from '../hooks/useNotificationContext';
import useSignalRContext from '../hooks/useSignalRContext';
import useAuthContext from '../hooks/useAuthContext';
import BaseApiService from '../services/BaseApiService';
import { useLocation, useNavigate } from 'react-router';
import useQueuingContext from '../hooks/useQueuingContext';
import useGameContext from '../hooks/useGameContext';
import { MAIN_PAGE_INVOKERS } from '../constants/invokers';
import { LOBBY_PAGE_HANDLERS, MAIN_PAGE_HANDLERS } from '../constants/handlers';
import { IInitializerContext } from './InitializerContext.types';
import { IBaseContextProps } from '../types/global';

export const initializerContext = createContext<IInitializerContext | null>(null);

export default function InitializerContext(
  { children } : IBaseContextProps
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
    await addHandler(MAIN_PAGE_HANDLERS.ON_GET_USER_CONNECTION_ID, (connectionId: string) => {
      setUserConnectionId(connectionId);
    });
    await addHandler(MAIN_PAGE_HANDLERS.ON_GENERIC_ERROR, (msg: string) => {
      setNotificationState({ 
        type: "SET_CUSTOMMESSAGE"
        , payload: { customMessage: msg, customMessageType: "DANGER" } 
      });
    });
    await addHandler(LOBBY_PAGE_HANDLERS.ON_GET_ROOM_KEY, (roomKey: string) => {
      setNotificationState({ type: "SET_HASAGAMEQUEUINGROOMKEY", payload: true });
      setQueuingRoomKey(roomKey);
    });
    await addHandler(LOBBY_PAGE_HANDLERS.ON_MATCH_FOUND, (roomKey: string) => {
      navigate(`/play/${roomKey}`);
    });
    await addHandler(MAIN_PAGE_HANDLERS.ON_HAS_A_GAME_IN_PROGRESS, (roomKey: string) => {
      // const inPlagePage = url.pathname.startsWith("/play/")
      // console.log("TODO onHasAGameInProgress: ", roomKey, inPlagePage, url)
      setGameState({ type: "SET_GAMEROOMKEY", payload: roomKey });
      setNotificationState({ type: "SET_HASAGAMEONGOING", payload: true });
    });
    
    await invoke(MAIN_PAGE_INVOKERS.GET_CONNECTION_ID);
    await invoke(MAIN_PAGE_INVOKERS.GET_HAS_A_GAME_IN_PROGRESS);
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
      removeHandler(MAIN_PAGE_HANDLERS.ON_GET_USER_CONNECTION_ID);
      removeHandler(LOBBY_PAGE_HANDLERS.ON_GET_ROOM_KEY);
      removeHandler(LOBBY_PAGE_HANDLERS.ON_MATCH_FOUND);
      removeHandler(MAIN_PAGE_HANDLERS.ON_HAS_A_GAME_IN_PROGRESS);
      removeHandler(MAIN_PAGE_HANDLERS.ON_GENERIC_ERROR);
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

import { createContext, useEffect, useMemo, useState } from 'react'
import useNotificationContext from '../hooks/useNotificationContext';
import useSignalRContext from '../hooks/useSignalRContext';
import useAuthContext from '../hooks/useAuthContext';
import BaseApiService from '../services/BaseApiService';
import { useLocation, useNavigate, useParams } from 'react-router';
import useQueuingContext from '../hooks/useQueuingContext';
import useGameContext from '../hooks/useGameContext';
import { MAIN_PAGE_INVOKERS, PLAY_PAGE_INVOKERS } from '../constants/invokers';
import { LOBBY_PAGE_HANDLERS, MAIN_PAGE_HANDLERS } from '../constants/handlers';
import { IBaseContextProps } from '../types/global';
import { IInitializerContext } from './types';
import { setImage } from '../utils/helper';
import useMultipleTabsDetector from '../hooks/useMultiTabDetector';

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
  const { userConnectionId } = useSignalRContext();
  const navigate = useNavigate();
  const [initialize, setInitialize] = useState<boolean>(true);
  const { setGameState, gameState } = useGameContext();
  const urlLocation = useLocation();
  const { } = useMultipleTabsDetector(initialize);

  // if not signed in, allowed urls are these
  const unAuthenticatedAllowedPaths = useMemo(() => ["/", "/about", "/register", "/login"], []);
  const authService = useMemo(() => new BaseApiService(), []);

  async function checkIfSignedIn() {
    let signedIn = false;
    const res = await authService.baseGet("/api/Auth/is-signed-in");
    
    if (res.status === 200){
      setUser({ userName: res.data.userName, profileImageUrl: setImage(res.data.profileImageUrl) });
      signedIn = true;
    }
    
    setIsAuthenticating(false);
    return signedIn;
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
      if (!roomKey){
        // setNotificationState({ 
        //   type: "SET_CUSTOMMESSAGE"
        //   , payload: { customMessage: `404 room not found.`, customMessageType: "DANGER" } 
        // });
        navigate("*");
        return;
      }
      navigate(`/play?gameRoomKey=${roomKey}&reconnect=false`);
    });
    await addHandler(MAIN_PAGE_HANDLERS.ON_HAS_A_GAME_IN_PROGRESS, (roomKey: string | null) => {
      setNotificationState({ type: "SET_HASAGAMEONGOING", payload: roomKey ? true : false });
      setGameState({ type: "SET_GAMEROOMKEY", payload: roomKey ? roomKey : "" });
    });
    
    await invoke(MAIN_PAGE_INVOKERS.GET_CONNECTION_ID);
    await invoke(MAIN_PAGE_INVOKERS.GET_HAS_A_GAME_IN_PROGRESS);
  }

  /**
   * Handles on page change event
   */
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    
    // will just check if a player has an ongoing game
    if (urlLocation.pathname !== "/play")
    {
      function handleDisconnect(){
        if (!gameState.gameRoomKey) return;

        setNotificationState({ type: "SET_HASAGAMEONGOING", payload: true });
        invoke(PLAY_PAGE_INVOKERS.USER_DISCONNECT_FROM_ONGOING_GAME);
      }

      addEventListener("beforeunload", handleDisconnect, { signal });

      handleDisconnect();
      invoke(MAIN_PAGE_INVOKERS.GET_HAS_A_GAME_IN_PROGRESS);
    }

    if (user) return;

    if (notificationState.customMessage){
      setNotificationState({ type: "SET_RESETNOTIFICATIONS" });
    }

    if (!unAuthenticatedAllowedPaths.includes(urlLocation.pathname)) {
      navigate('/login');
      return;
    }

    return () => {
    controller.abort();
    };
  }, [user, urlLocation.pathname, userConnectionId]);

  /**
   * This is the actual initializer of our app
   */
  useEffect(() => {

    if (!initialize) return;

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

    init();

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

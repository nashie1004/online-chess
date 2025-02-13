import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap"
import { IGameRoomList } from "../game/utilities/types";
import LobbyTable from "../components/lobby/LobbyTable";
import { toast } from "react-toastify";
import useSignalRContext from "../hooks/useSignalRContext";
import LobbyForm from "../components/lobby/LobbyForm";
import { useNavigate } from "react-router";
import { lobbyPageHandlers, lobbyPageInvokers, mainPageInvokers } from "../game/utilities/constants";
import useNotificationContext from "../hooks/useNotificationContext";

export default function Lobby() {
    const [gameRoomList, setGameRoomList] = useState<IGameRoomList>({ list: [], isLoading: true });
    const { userConnectionId, addHandler, removeHandler, invoke } = useSignalRContext();
    const navigate = useNavigate();
    const { notificationState, setNotificationState } = useNotificationContext();

    useEffect(() => {
        async function start(){
            await addHandler(lobbyPageHandlers.onRefreshRoomList, (roomList) => setGameRoomList({ isLoading: false, list: roomList }));
            await addHandler(lobbyPageHandlers.onInvalidRoomKey, (msg) => toast(msg, { type: "error" }));
            await addHandler(lobbyPageHandlers.onGetRoomKey, (roomKey: string) => {
                setNotificationState({ type: "SET_GAMEQUEUINGROOMKEY", payload: roomKey });
            });
            await addHandler(lobbyPageHandlers.onMatchFound, (roomKey: string) => navigate(`/play/${roomKey}`));

            await invoke(lobbyPageInvokers.getRoomList, 1);
            await invoke(lobbyPageInvokers.getCreatedRoomKey);
        }

        if (userConnectionId){
            start();
        }
        
        return () => {
            removeHandler(lobbyPageHandlers.onRefreshRoomList);
            removeHandler(lobbyPageHandlers.onInvalidRoomKey);
            removeHandler(lobbyPageHandlers.onGetRoomKey);
            removeHandler(lobbyPageHandlers.onMatchFound);
        }
    }, [])

    return <div className="col">
        <LobbyForm 
            setGameRoomList={setGameRoomList}
            roomKey={notificationState.gameQueuingRoomKey}
        />
        {notificationState.gameQueuingRoomKey ? <>
            <div className="game-alert">
                <Spinner size="sm" animation="border" variant="light" className="mt-3" /> 
                <span className="ps-2">
                    You have a game queuing... <a href="#" className="alert-link" onClick={() => {
                        invoke(mainPageInvokers.deleteRoom, notificationState.gameQueuingRoomKey);
                        setNotificationState({ type: "SET_GAMEQUEUINGROOMKEY", payload: null });
                    }}>Stop queuing?</a>
                </span>
            </div>
        </> : <></>}
        <LobbyTable 
            gameRoomList={gameRoomList}
            setGameRoomList={setGameRoomList}
        />
    </div>
}
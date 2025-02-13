import { useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap"
import { IGameRoomList } from "../game/utilities/types";
import LobbyTable from "../components/lobby/LobbyTable";
import { toast } from "react-toastify";
import useSignalRContext from "../hooks/useSignalRContext";
import useAuthContext from "../hooks/useAuthContext";
import LobbyForm from "../components/lobby/LobbyForm";
import { useNavigate } from "react-router";
import { lobbyPageHandlers, lobbyPageInvokers } from "../game/utilities/constants";

export default function Lobby() {
    const [gameRoomList, setGameRoomList] = useState<IGameRoomList>({ list: [], isLoading: true });
    const { isConnected, addHandler, removeHandler, invoke } = useSignalRContext();
    const { setUserConnectionId } = useAuthContext(); 
    const [roomKey, setRoomKey] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function start(){
            await addHandler(lobbyPageHandlers.onRefreshRoomList, (roomList) => setGameRoomList({ isLoading: false, list: roomList }));
            await addHandler(lobbyPageHandlers.onInvalidRoomKey, (msg) => toast(msg, { type: "error" }));
            await addHandler(lobbyPageHandlers.onGetUserConnectionId, (connectionId) => setUserConnectionId(connectionId));
            await addHandler(lobbyPageHandlers.onGetRoomKey, (roomKey) => setRoomKey(roomKey));
            await addHandler(lobbyPageHandlers.onMatchFound, (roomKey) => navigate(`/play/${roomKey}`));

            await invoke(lobbyPageInvokers.getRoomList, 1);
            await invoke(lobbyPageInvokers.getCreatedRoomKey);
        }

        if (isConnected){
            console.log("start")
            start();
        }
        
        return () => {
            removeHandler(lobbyPageHandlers.onRefreshRoomList);
            removeHandler(lobbyPageHandlers.onInvalidRoomKey);
            removeHandler(lobbyPageHandlers.onGetUserConnectionId);
            removeHandler(lobbyPageHandlers.onGetRoomKey);
            removeHandler(lobbyPageHandlers.onMatchFound);
            setUserConnectionId(null);
        }
    }, [])

    return <div className="col">
        <LobbyForm 
            setGameRoomList={setGameRoomList}
            roomKey={roomKey}
        />
        {roomKey ? <>
            <div className="game-alert">
                <Spinner size="sm" animation="border" variant="info" className="mt-3" /> 
                <span className="ps-2">
                    You have a game queuing... <a href="#" className="alert-link" onClick={() => {
                        invoke(lobbyPageInvokers.deleteRoom, roomKey)
                        setRoomKey(null);
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
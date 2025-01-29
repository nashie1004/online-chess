import { useEffect, useRef, useState } from "react";
import { Alert, Spinner } from "react-bootstrap"
import { IGameRoomList } from "../game/utilities/types";
import LobbyTable from "../components/lobby/LobbyTable";
import { toast } from "react-toastify";
import useSignalRContext from "../hooks/useSignalRContext";
import useAuthContext from "../hooks/useAuthContext";
import LobbyForm from "../components/lobby/LobbyForm";
import { useNavigate } from "react-router";

export default function Lobby() {
    const [gameRoomList, setGameRoomList] = useState<IGameRoomList>({ list: [], isLoading: true });
    const { startConnection, stopConnection, addHandler, removeHandler, invoke } = useSignalRContext();
    const { setUserConnectionId } = useAuthContext(); 
    const [roomKey, setRoomKey] = useState<string | null>(null);
    const navigate = useNavigate();
    const signalRConnectionRef = useRef<boolean | null>(null);

    useEffect(() => {
        async function start(){
            await startConnection(() => {});
            signalRConnectionRef.current = true;
    
            await addHandler("onRefreshRoomList", (roomList) => setGameRoomList({ isLoading: false, list: roomList }));
            await addHandler("onInvalidRoomKey", (msg) => toast(msg, { type: "error" }));
            await addHandler("onGetUserConnectionId", (connectionId) => setUserConnectionId(connectionId));
            await addHandler("onGetRoomKey", (roomKey) => setRoomKey(roomKey));
            await addHandler("onMatchFound", (roomKey) => navigate(`/play/${roomKey}`));

            await invoke("GetRoomList", 1);
            await invoke("GetCreatedRoomKey");
        }

        if (!signalRConnectionRef.current){
            console.log("start")
            start();
        }
        
        return () => {
            removeHandler("onRefreshRoomList");
            removeHandler("onInvalidRoomKey");
            removeHandler("onGetUserConnectionId");
            removeHandler("onGetRoomKey");
            removeHandler("onMatchFound");
            stopConnection();
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
                        invoke("DeleteRoom", roomKey)
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
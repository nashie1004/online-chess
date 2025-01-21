import { useEffect, useState } from "react";
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
    const { startConnection, stopConnection, addHandler, invoke } = useSignalRContext();
    const { setUserConnectionId } = useAuthContext(); 
    const [roomKey, setRoomKey] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function start(){
            await startConnection((e) => {});
    
            await addHandler("RefreshRoomList", (roomList) => setGameRoomList({ isLoading: false, list: roomList }));
            await addHandler("InvalidRoomKey", (msg) => toast(msg, { type: "error" }));
            await addHandler("GetUserConnectionId", (connectionId) => setUserConnectionId(connectionId));
            await addHandler("GetRoomKey", (roomKey) => setRoomKey(roomKey));
            await addHandler("MatchFound", (roomKey) => navigate(`/play/${roomKey}`));

            await invoke("GetRoomList", 1);
            await invoke("GetCreatedRoomKey");
        }

        start();
        
        return () => {
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
            <Alert variant="warning">
                <Spinner size="sm" animation="border" variant="success" className="mt-3" /> You have a game queuing... <a href="#" className="alert-link" onClick={() => {
                    invoke("DeleteRoom", roomKey)
                    setRoomKey(null);
                }}>Stop queuing?</a>
            </Alert>
        </> : <></>}
        <LobbyTable 
            gameRoomList={gameRoomList}
            setGameRoomList={setGameRoomList}
        />
    </div>
}
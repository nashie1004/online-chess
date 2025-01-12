import { useEffect, useState } from "react";
import { Alert } from "react-bootstrap"
import { NavLink,  } from "react-router";
import { IGameRoomList } from "../game/utilities/types";
import LobbyTable from "../components/LobbyTable";
import { toast } from "react-toastify";
import useSignalRContext from "../hooks/useSignalRContext";
import useAuthContext from "../hooks/useAuthContext";
import LobbyForm from "../components/LobbyForm";

export default function Lobby() {
    const [gameRoomList, setGameRoomList] = useState<IGameRoomList>({ list: [], isLoading: true });
    const { startConnection, stopConnection, addHandler, invoke } = useSignalRContext();
    const { setUserConnectionId } = useAuthContext(); 
    const [roomKey, setRoomKey] = useState<string | null>(null);

    useEffect(() => {
        setUserConnectionId(null);

        async function start(){
            await startConnection((e) => console.log(e));
    
            await addHandler("RefreshRoomList", (roomList) => setGameRoomList({ isLoading: false, list: roomList }));
            await addHandler("InvalidRoomKey", (msg) => toast(msg, { type: "error" }));
            await addHandler("GetUserConnectionId", (connectionId) => setUserConnectionId(connectionId));
            await addHandler("GetRoomKey", (roomKey) => setRoomKey(roomKey));

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
        <h3 className="my-3">Join</h3>
        {roomKey ? <>
            <Alert variant="warning">
                You have a game queuing... <a href="#" className="alert-link" onClick={() => {
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
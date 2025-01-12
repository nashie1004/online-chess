import { useEffect, useState } from "react";
import { Alert } from "react-bootstrap"
import { NavLink,  } from "react-router";
import { IGameRoomList } from "../game/utilities/types";
import { GameType } from "../game/utilities/constants";
import LobbyTable from "../components/LobbyTable";
import { toast } from "react-toastify";
import useSignalRContext from "../hooks/useSignalRContext";
import useAuthContext from "../hooks/useAuthContext";
import LobbyForm from "../components/LobbyForm";

export default function Lobby() {
    const [gameType, setGameType] = useState<GameType>(1);
    const [gameRoomList, setGameRoomList] = useState<IGameRoomList>({ list: [], isLoading: true });
    const { startConnection, stopConnection, addHandler, invoke } = useSignalRContext();
    const { setUserConnectionId } = useAuthContext(); 

    useEffect(() => {
        async function start(){
            await startConnection((e) => console.log(e));
    
            await addHandler("RefreshRoomList", (roomList) => {
                setGameRoomList({ isLoading: false, list: roomList });
            });
    
            await addHandler("InvalidRoomKey", (msg) => toast(msg, { type: "error" }));

            await addHandler("GetUserConnectionId", (connectionId) => {
                setUserConnectionId(connectionId);
            });
    
            await invoke("GetRoomList", 1);
        }

        start();
        
        return () => {
            stopConnection();
            setUserConnectionId(null);
        }
    }, [])

    return <div className="col">
        <LobbyForm 
            gameType={gameType}
            setGameType={setGameType}
            setGameRoomList={setGameRoomList}
        />
        <h3 className="my-3">Join</h3>
        <Alert variant="warning">
            You have a game queuing...
            <NavLink to="/play/123" className="alert-link">Play now</NavLink>
        </Alert>
        <LobbyTable 
            gameRoomList={gameRoomList}
            setGameRoomList={setGameRoomList}
        />
    </div>
}
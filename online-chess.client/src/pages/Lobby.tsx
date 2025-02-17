import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap"
import { IGameRoomList } from "../game/utilities/types";
import LobbyTable from "../components/lobby/LobbyTable";
import useSignalRContext from "../hooks/useSignalRContext";
import LobbyForm from "../components/lobby/LobbyForm";
import { lobbyPageInvokers, mainPageInvokers } from "../game/utilities/constants";
import useNotificationContext from "../hooks/useNotificationContext";
import useQueuingContext from "../hooks/useQueuingContext";
import { lobbyPageHandlers } from "../constants/handlers";

export default function Lobby() {
    const [gameRoomList, setGameRoomList] = useState<IGameRoomList>({ list: [], isLoading: true });
    const { userConnectionId, addHandler, removeHandler, invoke } = useSignalRContext();
    const { setNotificationState } = useNotificationContext();
    const { setQueuingRoomKey, queuingRoomKey } = useQueuingContext();

    useEffect(() => {
        async function start(){
            await addHandler(lobbyPageHandlers.onRefreshRoomList, (roomList) => setGameRoomList({ isLoading: false, list: roomList }));
       
            await invoke(lobbyPageInvokers.getRoomList, 1);
            await invoke(lobbyPageInvokers.getCreatedRoomKey);
        }

        if (userConnectionId){
            start();
        }
        
        return () => {
            removeHandler(lobbyPageHandlers.onRefreshRoomList);
        }
    }, [userConnectionId])

    return <div className="col">
        <LobbyForm 
            setGameRoomList={setGameRoomList}
            roomKey={queuingRoomKey}
        />
        {queuingRoomKey && <>
            <div className="game-alert">
                <Spinner size="sm" animation="border" variant="light" className="mt-3" /> 
                <span className="ps-2">
                    You have a game queuing... <a href="#" className="alert-link" onClick={() => {
                        setNotificationState({ type: "SET_HASAGAMEQUEUINGROOMKEY", payload: false });
                        setQueuingRoomKey(null);
                        invoke(mainPageInvokers.deleteRoom, queuingRoomKey);
                    }}>Stop queuing?</a>
                </span>
            </div>
        </>}
        <LobbyTable 
            gameRoomList={gameRoomList}
            setGameRoomList={setGameRoomList}
        />
    </div>
}
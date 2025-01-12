import { useEffect, useState } from "react";
import { Alert, Form } from "react-bootstrap"
import { NavLink,  } from "react-router";
import { IGameRoomList } from "../game/utilities/types";
import { GameType } from "../game/utilities/constants";
import LobbyTable from "../components/LobbyTable";
import { toast } from "react-toastify";
import useSignalRContext from "../hooks/useSignalRContext";
import { gameTypeDisplay } from "../utils/helper";
import useAuthContext from "../hooks/useAuthContext";

const gameTypes = [ GameType.Classical, GameType.Blitz3Mins, GameType.Blitz5Mins, GameType.Rapid10Mins, GameType.Rapid25Mins ];

export default function Lobby() {
    const [gameType, setGameType] = useState<GameType>(1);
    const [gameRoomList, setGameRoomList] = useState<IGameRoomList>({
        list: [], isLoading: true
    });
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
        }
    }, [])

    return <div className="col">
        <div className="mt-5 mt-3 w-50">
            <h3 className="">Find a match</h3>
            <Form
                onSubmit={(e) => {
                    e.preventDefault();
                    invoke("AddToQueue", gameType)
                }}
            >
                <Form.Group className="mb-3">
                    <Form.Select 
                        onChange={(e) => {
                            const val = Number(e.target.value) as GameType;
                            setGameType(val);
                        }}
                        aria-label="Game Type"
                    >
                        <option selected disabled>Choose Game Type</option>
                        {
                            gameTypes.map((item, idx) => {
                                return <option key={idx} value={gameType}>
                                    {gameTypeDisplay(item)}
                                </option>
                            })
                        }
                    </Form.Select>
                </Form.Group>
                <button type="submit" className="btn btn-primary w-100">Queue</button>
            </Form>
        </div>
        <h3 className="my-3">Join</h3>
        <Alert variant="warning">
            You have a game queuing...
            <NavLink to="/play/123" className="alert-link">Play now</NavLink>
        </Alert>
        <LobbyTable 
            gameRoomList={gameRoomList}
        />
    </div>
}
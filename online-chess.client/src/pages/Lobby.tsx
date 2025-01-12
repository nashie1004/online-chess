import { useEffect, useState } from "react";
import { Alert, Form } from "react-bootstrap"
import { NavLink,  } from "react-router";
import { IGameRoom } from "../game/utilities/types";
import { GameType } from "../game/utilities/constants";
import LobbyTable from "../components/LobbyTable";
import { toast } from "react-toastify";
import useSignalRContext from "../hooks/useSignalRContext";

export default function Lobby() {
    const [gameType, setGameType] = useState<GameType>(1);
    const [gameRoomList, setGameRoomList] = useState<IGameRoom[]>([]);
    const signalRContext = useSignalRContext(); 

    useEffect(() => {

        async function start(){
            await signalRContext.startConnection((e) => console.log(e));

            console.log(123)
            await signalRContext.addHandler("RefreshRoomList", (roomList) => {
                setGameRoomList(roomList);
            });

            await signalRContext.addHandler("InvalidRoomKey", (msg) => {
                if (msg) toast(msg, { type: "error" })
            });

            await signalRContext.invoke("GetRoomList");
        }

        start();

        return () => {
            signalRContext.stopConnection();
        }
    }, [])

    async function formSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault()  
        await signalRContext.invoke("AddToQueue", gameType)
    }

    return <div className="col">
        <div className="mt-5 mt-3 w-50">
            <h3 className="">Find a match</h3>
            <Form
                onSubmit={formSubmit}
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
                        <option value="1">Classical (1 hour per player)</option>
                        <option value="2">Blitz (3 minutes per player)</option>
                        <option value="3">Blitz (5 minutes per player)</option>
                        <option value="4">Rapid (10 minutes per player)</option>
                        <option value="5">Rapid (25 minutes per player)</option>
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
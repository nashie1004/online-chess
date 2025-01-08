import { useEffect, useState } from "react";
import { Alert, Button, Form, Modal, Pagination, Table } from "react-bootstrap"
import { NavLink, useNavigate,  } from "react-router";
import SignalRConnection from "../services/SignalRService";
import { IGameRoom } from "../game/utilities/types";
import { GameType } from "../game/utilities/constants";
import moment from "moment";

const connection = new SignalRConnection();

export default function Lobby() {
    const [gameType, setGameType] = useState<GameType>(1);
    const [gameRoomList, setGameRoomList] = useState<IGameRoom[]>([]); 
    const navigate = useNavigate();
    const [modalShow, setModalShow] = useState(false);

    useEffect(() => {

        async function start(){
            await connection.startConnection((e) => console.log(e));

            await connection.addHandler("RefreshRoomList", (data) => {
                //console.log("RefreshRoomList: ", data)
                setGameRoomList(data);
            });

            await connection.invoke("GetRoomList");
        }

        start();

        return () => {
            connection.stopConnection();
        }
    }, [])

    async function formSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault()  

        await connection.invoke("AddToQueue", gameType)
        //navigate("/play")
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
        <Table responsive striped size="sm">
            <thead>
                <tr>
                    <th>Action</th>
                    <th>Player Username</th>
                    <th>Looking for Game Type</th>
                    <th>Last Update Date</th>
                </tr>
            </thead>
            <tbody>
                {gameRoomList.map((item, idx) => {
                    
                    return <tr key={idx}>
                        <td className="d-flex gap-2">
                            <button 
                                onClick={() => setModalShow(true)}
                                className="btn btn-outline-primary btn-sm">View</button>
                            <button 
                                className="btn btn-outline-danger btn-sm">Delete</button>
                        </td>
                        <td>{item.value.createdByUserId}</td>
                        <td>{item.value.gameType}</td>
                        <td>{moment(item.value.createDate).fromNow()}</td>
                    </tr>
                })}
            </tbody>
        </Table>
        <Pagination>
            <Pagination.Prev />
            <Pagination.Item disabled>{1}</Pagination.Item>
            <Pagination.Next />
        </Pagination>
        
        <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={modalShow}
            onHide={() => setModalShow(false)}
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                Confirmation
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure you want to resign?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => {
                    setModalShow(false)
                    navigate("/play/234")
                }}>Yes</Button>
            </Modal.Footer>
            </Modal>
    </div>
}
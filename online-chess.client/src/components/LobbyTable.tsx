import moment from "moment"
import { Table, Pagination, Modal, Button, Spinner } from "react-bootstrap"
import { IGameRoom, IGameRoomList } from "../game/utilities/types"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useSignalRContext from "../hooks/useSignalRContext";
import { gameTypeDisplay } from "../utils/helper";
import useAuthContext from "../hooks/useAuthContext";

interface ILobbyTable{
    setGameRoomList: React.Dispatch<React.SetStateAction<IGameRoomList>>;
    gameRoomList: IGameRoomList
}

export default function LobbyTable({
    gameRoomList, setGameRoomList
}: ILobbyTable){
    const [selectedRoom, setSelectedRoom] = useState<IGameRoom | null>(null);
    const [modal, setModal] = useState<boolean>(false);
    const navigate = useNavigate();
    const { invoke } = useSignalRContext();
    const [pageNo, setPageNo] = useState<number>(1);
    const { user } = useAuthContext();

    useEffect(() => {
        invoke("GetRoomList", pageNo);
    }, [pageNo])

    return <>
        <Table responsive striped size="sm">
            <thead>
                <tr>
                    <th className="col-3">Action</th>
                    <th className="col-3">Player Username</th>
                    <th className="col-3">Looking for Game Type</th>
                    <th className="col-3">Last Update Date</th>
                </tr>
            </thead>
            <tbody>
                {
                    gameRoomList.isLoading ? <>
                        <Spinner animation="border" variant="dark" className="mt-3" /> 
                    </> : gameRoomList.list.map((item, idx) => {

                    return <tr key={idx}>
                        <td className="d-flex gap-2">
                            <button 
                                onClick={() => {
                                    setSelectedRoom(item)
                                    setModal(true)
                                }}
                                className="btn btn-outline-primary btn-sm">View</button>
                            {
                                user?.connectionId === item.value.createdByUserId ? <>
                                    <button 
                                        onClick={() => {
                                            setGameRoomList(prev => ({ ...prev, isLoading: true }));
                                            invoke("DeleteRoom", item.key)
                                        }}
                                        className="btn btn-outline-danger btn-sm">Delete</button>
                                </> : <></>
                            }
                        </td>
                        <td>{user?.connectionId === item.value.createdByUserId ? "You" : item.value.createdByUserId}</td>
                        <td>{gameTypeDisplay(item.value.gameType)}</td>
                        <td>{moment(item.value.createDate).fromNow()}</td>
                    </tr>
                })}
            </tbody>
        </Table>
        <Pagination>
            <Pagination.Prev 
                onClick={() => {
                    setGameRoomList(prev => ({ ...prev, isLoading: true }));
                    setPageNo(prev => Math.max(prev - 1, 1));
                }}
            />
            <Pagination.Item disabled>{pageNo}</Pagination.Item>
            <Pagination.Next 
                onClick={() => {
                    setGameRoomList(prev => ({ ...prev, isLoading: true }));
                    setPageNo(prev => prev + 1);
                }}
            />
        </Pagination>
        
        <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={modal}
            onHide={() => {
                setModal(false);
            }}
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Confirmation
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Are you sure you want to join this game?</h5>
                {
                    selectedRoom ? <>
                        <p>Connection Id: {selectedRoom.key}</p>
                        <p>Created By User: {selectedRoom.value.createdByUserId}</p>
                        <p>Game Type: {selectedRoom.value.gameType}</p>
                        <p>Last Update Date: {moment(selectedRoom.value.createDate).fromNow()}</p>
                    </> : <></>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => {
                    setModal(false)
                    navigate(`/play/${selectedRoom?.key ?? ""}`)
                }}>Play</Button>
            </Modal.Footer>
            </Modal>
    </>
}
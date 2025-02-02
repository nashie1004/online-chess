import moment from "moment"
import { Table, Modal, Spinner } from "react-bootstrap"
import { IGameRoom, IGameRoomList } from "../../game/utilities/types"
import { useEffect, useState } from "react";
import useSignalRContext from "../../hooks/useSignalRContext";
import { colorOptionsDisplay, gameTypeDisplay } from "../../utils/helper";
import useAuthContext from "../../hooks/useAuthContext";
import { lobbyPageInvokers } from "../../game/utilities/constants";

interface ILobbyTable{
    setGameRoomList: React.Dispatch<React.SetStateAction<IGameRoomList>>;
    gameRoomList: IGameRoomList
}

export default function LobbyTable({
    gameRoomList, setGameRoomList
}: ILobbyTable){
    const [selectedRoom, setSelectedRoom] = useState<IGameRoom | null>(null);
    const [modal, setModal] = useState<boolean>(false);
    const { invoke } = useSignalRContext();
    const [pageNo, setPageNo] = useState<number>(1);
    const { user } = useAuthContext();

    useEffect(() => {
        invoke(lobbyPageInvokers.getRoomList, pageNo);
    }, [pageNo])

    return <>
        <div className="table-title">
            <h5 className="">
                <i className="bi bi-people-fill pe-2"></i> <span>JOIN A MATCH</span>
            </h5>
        </div>
        <Table responsive striped>
            <thead className="bg-warning">
                <tr>
                    <th className="col-1">
                        <i className="bi bi-gear"  style={{ color: "#FFFFFF",  }}></i> Action
                    </th>
                    <th className="col-4">
                        <i className="bi bi-person"  style={{ color: "#FFFFFF",  }}></i> Username
                    </th>
                    <th className="col-3">
                        <i className="bi bi-hourglass" style={{color: "#FFFFFF"}}></i> Game Type 
                    </th>
                    <th className="col-2">
                        <i className="bi bi-circle-half"  style={{ color: "#FFFFFF",  }}></i> Color
                    </th>
                    <th className="col-2">
                        <i className="bi bi-calendar2-fill" style={{color: "#FFFFFF"}}></i> Create Date 
                    </th>
                </tr>
            </thead>
            <tbody>
                {
                    gameRoomList.isLoading ? <>
                        <Spinner animation="border" variant="dark" className="mt-3" /> 
                    </> : gameRoomList.list.map((item, idx) => {

                    return <tr key={idx}> 
                        <td>
                            {user?.userName !== item.value.createdByUserId ? <>
                                <button 
                                    onClick={() => {
                                        setSelectedRoom(item)
                                        setModal(true)
                                    }}
                                    className="btn btn-2 btn-sm w-100">View</button>
                            </> : <></>}
                        </td>
                        <td>{user?.userName === item.value.createdByUserId ? "You" : item.value.createdByUserId}</td>
                        <td>{gameTypeDisplay(item.value.gameType)}</td>
                        <td>{colorOptionsDisplay(item.value.createdByUserColor)}</td>
                        <td>{moment(item.value.createDate).fromNow()}</td>
                    </tr>
                })}
            </tbody>
        </Table>
        <div>
        <div className="table-footer">
            <ul className="table-pagination">
            <li
                className="skip-end"
                onClick={() => {
                    if (pageNo > 1){
                        setGameRoomList(prev => ({ ...prev, isLoading: true }));
                    }
                    setPageNo(prev => Math.max(prev - 1, 1));
                }}
            >
                <i className="bi bi-skip-start-fill" style={{ color: "#A8A8A7", fontSize: "1.35rem" }}  ></i>
            </li>
            <li className="page-no">
                {pageNo}
            </li>
            <li
                className="skip-start"
                onClick={() => {
                    setGameRoomList(prev => ({ ...prev, isLoading: true }));
                    setPageNo(prev => prev + 1);
                }}
            >
                <i className="bi bi-skip-end-fill" style={{ color: "#A8A8A7", fontSize: "1.35rem" }} ></i>
            </li>
            </ul>
        </div>
        </div>

        <Modal
            size="lg"
            centered
            show={modal}
            onHide={() => {
                setModal(false);
            }}
            >
            <Modal.Body>
                <div className="m-header">
                    <h5>Are you sure you want to join this game?</h5>
                </div>
                <div className="m-body">
                    {
                        selectedRoom ? <>
                            <p><b>Connection Id:</b> {selectedRoom.key}</p>
                            <p><b>Created By User:</b> {selectedRoom.value.createdByUserId}</p>
                            <p><b>Game Type:</b> {gameTypeDisplay(selectedRoom.value.gameType)}</p>
                            <p><b>Create Date Time:</b> {moment(selectedRoom.value.createDate).fromNow()}</p>
                        </> : <></>
                    }
                </div>
                <div className="m-footer">
                    <button 
                        className="btn btn-1 w-25"
                        onClick={() => {
                            setModal(false);
                            invoke(lobbyPageInvokers.joinRoom, selectedRoom?.key);
                        }}>Play</button>
                </div>
            </Modal.Body>
            </Modal>
    </>
}
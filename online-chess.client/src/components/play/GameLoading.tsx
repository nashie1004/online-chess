import { Modal, Spinner } from "react-bootstrap";
import useGameContext from "../../hooks/useGameContext";

export default function GameLoading(){
    const { gameState } = useGameContext();

    return <>

        <Modal 
            id="modal-loading"
            show={gameState.gameStatus === "LOADING"}
            centered
            style={{ backgroundColor: "rgba(0,0,0,0) !important" }}
        >
            <div>
                <Spinner animation="border" variant="info"  />
            </div>
        </Modal>

    </>
}
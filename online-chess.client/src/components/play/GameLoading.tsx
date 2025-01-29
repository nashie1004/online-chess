import { Modal, Spinner } from "react-bootstrap";
import useGameContext from "../../hooks/useGameContext";

export default function GameLoading(){
    const { gameState } = useGameContext();

    return <>

        <Modal 
            id="modal-loading"
            show={gameState.gameStatus === "LOADING"}
            centered
        >
            <div>
                <Spinner animation="border" variant="light"  />
            </div>
        </Modal>

    </>
}
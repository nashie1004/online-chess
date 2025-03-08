import { Modal, Spinner } from "react-bootstrap";
import useGameUIHandlerContext from "../../hooks/useGameUIHandlerContext";

export default function GameLoading(){
    const { showLoadingModal } = useGameUIHandlerContext();

    return <>
        <Modal 
            id="modal-loading"
            show={showLoadingModal}
            centered
        >
            <div>
                <Spinner animation="border" variant="light"  />
            </div>
        </Modal>
    </>
}
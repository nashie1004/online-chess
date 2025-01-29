import { Modal } from "react-bootstrap";
import useGameContext from "../../hooks/useGameContext";
import { useState } from "react";
import useSignalRContext from "../../hooks/useSignalRContext";

export default function DrawRequestModal(){
    const { gameState, setGameState } = useGameContext();
    const [modalShow, setModalShow] = useState(false);
    const { invoke } = useSignalRContext();

    async function formSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setGameState({ type: "SET_GAMESTATUS", payload: "LOADING" });
        invoke("DrawAgree", gameState.gameRoomKey);
        setModalShow(false);
    }

    console.log("draw request modal: ", gameState)

    return <>
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={modalShow || gameState.opponentInfo.isOfferingADraw}
        onHide={() => setModalShow(false)}
      >
        <Modal.Body>
          <form className="m-body" onSubmit={formSubmit}>
          <h5>{gameState.opponentInfo.userName} is requesting a draw.</h5>
            <div className="d-flex justify-content-end">
              <button 
                type='submit'
                className="btn btn-1 w-100 mt-5 "
                >
                Accept Draw?
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
}
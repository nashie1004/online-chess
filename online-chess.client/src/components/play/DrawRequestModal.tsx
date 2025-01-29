import { Modal } from "react-bootstrap";
import useGameContext from "../../hooks/useGameContext";
import { useState } from "react";
import useSignalRContext from "../../hooks/useSignalRContext";

export default function DrawRequestModal(){
    const { gameState, setGameState } = useGameContext();
    const [modalShow, setModalShow] = useState(false);
    const { invoke } = useSignalRContext();
    const [confirmValue, setConfirmValue] = useState<0 | 1>(0); // 0 = decline, 1 = accept

    async function formSubmit(e: React.FormEvent<HTMLFormElement>){
      e.preventDefault();
      setModalShow(false);
      setGameState({ type: "SET_GAMESTATUS", payload: "LOADING" });
      invoke("DrawAgree", gameState.gameRoomKey, confirmValue === 1);
    }

    return <>
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={modalShow || gameState.opponentInfo.isOfferingADraw}
      >
        <Modal.Body>
          <form className="m-body" onSubmit={formSubmit}>
          <h5>{gameState.opponentInfo.userName} is requesting a draw.</h5>
            <div className="">
              <button 
                type='submit'
                onClick={() => setConfirmValue(0)}
                className="btn btn-2 w-100 mt-5 mb-3"
                >
                Decline
              </button>
              <button 
                type='submit'
                onClick={() => setConfirmValue(1)}
                className="btn btn-1 w-100 "
                >
                Accept Draw?
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
}
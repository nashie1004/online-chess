import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import useSignalRContext from '../../hooks/useSignalRContext';
import useGameContext from '../../hooks/useGameContext';
import { PLAY_PAGE_INVOKERS } from '../../constants/invokers';

export default function GameOutcome() {
    const [modalShow, setModalShow] = React.useState(false);
    const [outcome, setOutcome] = useState<0 | 1>(0); // 0 = resign, 1 = draw
    const { invoke } = useSignalRContext();
    const { gameState, setGameState } = useGameContext();

    async function formSubmit(e: React.FormEvent<HTMLFormElement>){
      e.preventDefault();
      setGameState({ type: "SET_GAMESTATUS", payload: "LOADING" });
      invoke(outcome === 0 ? PLAY_PAGE_INVOKERS.RESIGN : PLAY_PAGE_INVOKERS.REQUEST_A_DRAW, gameState.gameRoomKey);
      setModalShow(false);
    }

    return (
    <>
        <div className='hstack gap-1 mt-3'>
            <button 
                type='button'
                onClick={() =>  {
                  setOutcome(0);
                  setModalShow(true);
                }}
                className='btn w-100 btn-2'>
                  <i className="bi bi-flag-fill"></i> Resign
                </button>
            <button 
                type='button'
                onClick={() => {
                  setOutcome(1); 
                  setModalShow(true);
                }}
                className='btn w-100  btn-2'>
                  <i className="bi bi-person-fill-dash"></i> Offer a Draw
                </button>
        </div>

        <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={modalShow}
      onHide={() => setModalShow(false)}
    >
      <Modal.Body>
        <form className="m-body" onSubmit={formSubmit}>
          {outcome === 0 ? <>
            <h5>Are you sure you want to resign?</h5>
            </> : <>
            <h5>Are you sure you want to request a draw?</h5>
          </>}
          <div className="d-flex justify-content-end">
            <button 
              type='submit'
              className="btn btn-1 w-100 mt-5 "
              >
              Yes
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
    </>
  )
}

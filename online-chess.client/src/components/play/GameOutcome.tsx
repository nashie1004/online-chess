import React from 'react'
import { Modal, Button } from 'react-bootstrap';

export default function GameOutcome() {
    const [modalShow, setModalShow] = React.useState(false);
  
    return (
    <>
        <div className='hstack gap-1 mt-3'>
            <button 
                type='button'
                onClick={() =>  setModalShow(true)}
                className='btn w-100 btn-2'>
                  <i className="bi bi-flag-fill"></i> Resign
                </button>
            <button 
                type='button'
                onClick={() =>  setModalShow(true)}
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
        <div className="m-body">
          <h5>Are you sure you want to resign?</h5>
          <div className="d-flex justify-content-end">
            <button 
              className="btn btn-1 w-100 mt-5 btn-lg"
              onClick={() => setModalShow(false)}>
              Yes
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
    </>
  )
}

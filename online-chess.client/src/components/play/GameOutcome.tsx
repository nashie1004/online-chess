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
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={modalShow}
      onHide={() => setModalShow(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Resignation
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to resign?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setModalShow(false)}>Yes</Button>
      </Modal.Footer>
    </Modal>
    </>
  )
}

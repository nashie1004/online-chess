import { Modal } from "react-bootstrap";
import useGameContext from "../../hooks/useGameContext"
import { useState } from "react";

export default function PromotionPickerModal() {
  const {} = useGameContext();
    const [modal, setModal] = useState<boolean>(false);

  return (
    <>
    
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
              <h5>Promotion Confirmation</h5>
          </div>
          <div className="m-body">
            <p>Lorem ipsum dolor sit amet.</p>
          </div>
          <div className="m-footer">
              <button 
                  className="btn btn-1 w-25"
                  onClick={() => {
                      alert("TODO")
                  }}>Promote</button>
          </div>
      </Modal.Body>
      </Modal>
    </>
  )
}

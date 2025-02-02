import { Modal } from "react-bootstrap";
import useGameContext from "../../hooks/useGameContext"
import { useState } from "react";
import bQ from "../../assets/pieces/cburnett/bQ.svg"
import bB from "../../assets/pieces/cburnett/bB.svg"
import bN from "../../assets/pieces/cburnett/bN.svg"
import bR from "../../assets/pieces/cburnett/bR.svg"
import { PromoteOptions, PromoteTo } from "../../game/utilities/types";

export default function PromotionPickerModal() {
  const {} = useGameContext();
    const [modal, setModal] = useState<boolean>(true);
    const [selectedOption, setSelectedOption] = useState<PromoteTo>("queen");

  const pieces: PromoteOptions[] = [ 
    { name: "queen", assetURL: bQ },
    { name: "bishop", assetURL: bB },
    { name: "knight", assetURL: bN },
    { name: "rook", assetURL: bR },
  ]

  return (
    <>
    
    <Modal
      id="promotion-picker-modal"
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
          <div className="m-body d-flex justify-content-center gap-2">
            {
              pieces.map((item, idx) => {
                return <img 
                  key={idx} 
                  alt={item.name} 
                  src={item.assetURL}
                  className={item.name === selectedOption ? "selected-promote-option" : ""}
                  onClick={() => {
                    setSelectedOption(item.name);  
                  }}
                   />
              })
            }
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

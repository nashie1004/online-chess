import { Modal } from "react-bootstrap";
import useGameContext from "../../hooks/useGameContext"
import { useCallback, useMemo, useState } from "react";
import { PromoteOptions, PromoteTo } from "../../game/utilities/types";
import useLocalStorage from "../../hooks/useLocalStorage";

export default function PromotionPickerModal() {
  const { setGameState, gameState } = useGameContext();
  const [selectedOption, setSelectedOption] = useState<PromoteTo>("queen");
  const { data: piece } = useLocalStorage("piece", "cburnett");

  const playerIsWhite = gameState.myInfo.playerIsWhite;
  const piecePath = `/src/assets/pieces/${piece}/`;

  const imgFn = useCallback((firstTwoChars: string) => {
    return `${piecePath}${firstTwoChars}.svg`;
  }, []);

  const pieces: PromoteOptions[] = useMemo(() => {
    return [ 
      { name: "queen", assetURL: imgFn(playerIsWhite ? "wQ" : "bQ") },
      { name: "bishop", assetURL: imgFn(playerIsWhite ? "wB" : "bB") },
      { name: "knight", assetURL: imgFn(playerIsWhite ? "wN" : "bN") },
      { name: "rook", assetURL: imgFn(playerIsWhite ? "wR" : "bR") },
    ]
  }, []);

  return (
    <>
    
    <Modal
      id="promotion-picker-modal"
      size="lg"
      centered
      show={gameState.myInfo.openPromotionModal}
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
                  setGameState({ type: "SET_MYINFO_PROMOTEPAWNTO", payload: selectedOption });
                  setGameState({ type: "SET_MYINFO_OPENPROMOTIONMODAL", payload: false });
                }}>Promote</button>
          </div>
      </Modal.Body>
      </Modal>
    </>
  )
}

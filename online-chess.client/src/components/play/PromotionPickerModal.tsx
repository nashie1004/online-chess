import { Modal } from "react-bootstrap";
import useGameContext from "../../hooks/useGameContext"
import { useCallback, useMemo, useState } from "react";
import { PromoteOptions, PromotionPrefence } from "../../game/utilities/types";
import useLocalStorage from "../../hooks/useLocalStorage";
import useSignalRContext from "../../hooks/useSignalRContext";
import { PLAY_PAGE_INVOKERS } from "../../constants/invokers";

export default function PromotionPickerModal() {
  const { setGameState, gameState } = useGameContext();
  const [selectedOption, setSelectedOption] = useState<PromotionPrefence>(PromotionPrefence.Queen);
  const { data: piece } = useLocalStorage("piece", "cburnett");
  const { invoke } = useSignalRContext();

  const playerIsWhite = gameState.myInfo.playerIsWhite;
  const piecePath = `/src/assets/pieces/${piece}/`;

  const imgFn = useCallback((firstTwoChars: string) => {
    return `${piecePath}${firstTwoChars}.svg`;
  }, []);

  const pieces: PromoteOptions[] = useMemo(() => {
    return [ 
      { name: PromotionPrefence.Queen, assetURL: imgFn(playerIsWhite ? "wQ" : "bQ") },
      { name: PromotionPrefence.Bishop, assetURL: imgFn(playerIsWhite ? "wB" : "bB") },
      { name: PromotionPrefence.Knight, assetURL: imgFn(playerIsWhite ? "wN" : "bN") },
      { name: PromotionPrefence.Rook, assetURL: imgFn(playerIsWhite ? "wR" : "bR") },
    ]
  }, [gameState]);

  const submitPromotionPreference = () => {
    invoke(PLAY_PAGE_INVOKERS.SET_PROMOTION_PREFERENCE, gameState.gameRoomKey, selectedOption);
    setGameState({ type: "SET_MYINFO_OPENPROMOTIONMODAL", payload: false });
  };

  return (
    <>
    
    <Modal
      id="promotion-picker-modal"
      size="lg"
      centered
      show={gameState.myInfo.openPromotionModal}
      onHide={() => {
        setGameState({ type: "SET_MYINFO_OPENPROMOTIONMODAL", payload: false });
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
                  alt={item.name.toString()} 
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
                onClick={() => submitPromotionPreference()}>Promote</button>
          </div>
      </Modal.Body>
      </Modal>
    </>
  )
}

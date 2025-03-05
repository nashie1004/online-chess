import { Form, Modal } from "react-bootstrap";
import useLocalStorage from "../../hooks/useLocalStorage";
import boardUI from "../../constants/boardUI";
import pieceUI from "../../constants/pieceUI";
import useSignalRContext from "../../hooks/useSignalRContext";
import { useMemo, useState } from "react";
import { PromotionPrefence } from "../../game/utilities/constants";
import { PromoteOptions } from "../../game/utilities/types";
import useGameContext from "../../hooks/useGameContext";
import { PLAY_PAGE_INVOKERS } from "../../constants/invokers";

export default function GameUIChanger(){
  const { setValue: setBoard, data: board } = useLocalStorage("board", "green.png");
  const { setValue: setPiece, data: piece } = useLocalStorage("piece", "cburnett");
    const { userConnectionId, invoke } = useSignalRContext();
  const { setGameState, gameState } = useGameContext();
  const [selectedOption, setSelectedOption] = useState<PromotionPrefence>(PromotionPrefence.Queen);

  const playerIsWhite = gameState.myInfo.playerIsWhite;
  const piecePath = `/src/assets/pieces/${piece}/`;

  const imgFn = (firstTwoChars: string) => `${piecePath}${firstTwoChars}.svg`;

  const pieces: PromoteOptions[] = useMemo(() => {
    return [ 
      { name: PromotionPrefence.Queen, assetURL: imgFn(playerIsWhite ? "wQ" : "bQ") },
      { name: PromotionPrefence.Bishop, assetURL: imgFn(playerIsWhite ? "wB" : "bB") },
      { name: PromotionPrefence.Knight, assetURL: imgFn(playerIsWhite ? "wN" : "bN") },
      { name: PromotionPrefence.Rook, assetURL: imgFn(playerIsWhite ? "wR" : "bR") },
    ]
  }, [gameState]);
  
    return <>
        
        <Modal
            centered
            show={gameState.openOptionModal}
            onHide={() => {
                setGameState({ type: "SET_OPENOPTIONMODAL", payload: false });
            }}
            >
            <Modal.Body>
                <div className="m-header">
                    <h5><i className="bi bi-gear pe-1"  style={{ color: "#FFFFFF" }} /> Game Options</h5>
                </div>
                <Form className='m-body'>
                    <Form.Group className="mb-3 d-flex">
                        <Form.Label column sm={3}>Board:</Form.Label>
                        <Form.Select 
                            disabled={!userConnectionId}
                            onChange={(e) => {
                                setBoard(e.target.value);
                            }}
                            value={board}
                            className='w-100'>
                            {boardUI.map((item, idx) => {
                                return <option key={idx} value={item.displayCode}>{item.displayName}</option>
                            })}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex">
                        <Form.Label column sm={3}>Piece:</Form.Label>
                        <Form.Select  
                            disabled={!userConnectionId}
                            onChange={(e) => {
                                setPiece(e.target.value);
                            }}
                            value={piece}
                            className='w-100'>
                            {pieceUI.map((item, idx) => {
                                return <option key={idx} value={item.displayCode}>{item.displayName}</option>
                            })}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex">
                        <Form.Label column sm={3} className="d-flex align-items-center">Promote:</Form.Label>
                        <div className="d-flex justify-content-center flex-fill">
                            {pieces.map((item, idx) => {
                                return <img 
                                    key={idx} 
                                    alt={item.name.toString()} 
                                    src={item.assetURL}
                                    className={item.name === selectedOption ? "selected-promote-option" : ""}
                                    onClick={() => {
                                        setSelectedOption(item.name);  
                                        invoke(PLAY_PAGE_INVOKERS.SET_PROMOTION_PREFERENCE, gameState.gameRoomKey, selectedOption);
                                    }}
                                />
                            })}
                        </div>
                    </Form.Group>
                </Form>
                <div className="m-footer"></div>
            </Modal.Body>
            </Modal>
    </>
}
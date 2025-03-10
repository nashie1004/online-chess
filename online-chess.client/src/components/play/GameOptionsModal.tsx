import { Form, Modal } from "react-bootstrap";
import boardUIOptions from "../../constants/boardUI";
import pieceUIOptions from "../../constants/pieceUI";
import useSignalRContext from "../../hooks/useSignalRContext";
import { useState } from "react";
import { PromotionPrefence } from "../../game/utilities/constants";
import { PromoteOptions } from "../../game/utilities/types";
import useGameContext from "../../hooks/useGameContext";
import { PLAY_PAGE_INVOKERS } from "../../constants/invokers";
import { EVENT_ON } from "../../constants/emitters";
import { eventEmitter } from "../../game/utilities/eventEmitter";
import useUserPreferenceContext from "../../hooks/useUserPreferenceContext";

export default function GameOptionsModal(){
  const { setBoard, setPiece, setShowCoords, boardUI, pieceUI, showCoords } = useUserPreferenceContext();
  const { userConnectionId, invoke } = useSignalRContext();
  const { setGameState, gameState } = useGameContext();
  const [selectedOption, setSelectedOption] = useState<PromotionPrefence>(PromotionPrefence.Queen);

  const playerIsWhite = gameState.myInfo.playerIsWhite;
  const piecePath = `/src/assets/pieces/${pieceUI}/`;

  const imgFn = (firstTwoChars: string) => `${piecePath}${firstTwoChars}.svg`;

  const pieces: PromoteOptions[] = [
      { name: PromotionPrefence.Queen, assetURL: imgFn(playerIsWhite ? "wQ" : "bQ") },
      { name: PromotionPrefence.Bishop, assetURL: imgFn(playerIsWhite ? "wB" : "bB") },
      { name: PromotionPrefence.Knight, assetURL: imgFn(playerIsWhite ? "wN" : "bN") },
      { name: PromotionPrefence.Rook, assetURL: imgFn(playerIsWhite ? "wR" : "bR") },
    ];
  
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
                    <h5><i className="bi bi-gear pe-1"  style={{ color: "#FFFFFF" }} /> Game Settings</h5>
                </div>
                <Form className='m-body'>
                    <Form.Group className="mb-3 d-flex">
                        <Form.Label column sm={3}>Board:</Form.Label>
                        <Form.Select 
                            disabled={!userConnectionId}
                            onChange={(e) => {
                                setBoard(e.target.value);
                                eventEmitter.emit(EVENT_ON.SET_BOARD_UI, e.target.value);
                            }}
                            value={boardUI}
                            className='w-100'>
                            {boardUIOptions.map((item, idx) => {
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
                                eventEmitter.emit(EVENT_ON.SET_PIECE_UI, e.target.value);
                            }}
                            value={pieceUI}
                            className='w-100'>
                            {pieceUIOptions.map((item, idx) => {
                                return <option key={idx} value={item.displayCode}>{item.displayName}</option>
                            })}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex">
                        <Form.Label column sm={3}>Show Coordinates:</Form.Label>
                        <Form.Check
                            checked={showCoords}
                            onChange={() => {
                                setShowCoords(!showCoords ? "true" : "false");
                                eventEmitter.emit(EVENT_ON.SET_COORDS_UI_SHOW, !showCoords);
                            }}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex">
                        <Form.Label column sm={3} className="d-flex align-items-center">Promote:</Form.Label>
                        <div className="d-flex justify-content-center flex-fill">
                            {pieces.map((item, idx) => {
                                return <img 
                                    key={idx} 
                                    alt={item.name.toString()} 
                                    src={item.assetURL}
                                    style={{ cursor: "pointer "}}
                                    className={item.name === selectedOption ? "selected-promote-option" : ""}
                                    onClick={() => {
                                        if (!userConnectionId) return;
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
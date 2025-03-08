import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import useGameContext from '../../hooks/useGameContext';
import useGameUIHandlerContext from '../../hooks/useGameUIHandlerContext';


export default function GameOutcomeModal(
) {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const { gameState } = useGameContext();
    const { gameOverMessage } = useGameUIHandlerContext();
  
  return (
    <>
    
    <Modal
        centered
        show={show || gameState.gameStatus === "FINISHED" || gameOverMessage !== ""}
        onHide={() => setShow(false)}
        >
        <Modal.Body>
            <div className="m-header">
                <h5>Game Over</h5>
            </div>
            <div className="m-body">
                <h6>{gameOverMessage}</h6>
                <button 
                    onClick={() => navigate("/lobby")}
                    className='btn btn-1 w-100 mt-4'>Go To Lobby</button>
            </div>
            <div className="m-footer"></div>
        </Modal.Body>
        </Modal>
    </>
  )
}

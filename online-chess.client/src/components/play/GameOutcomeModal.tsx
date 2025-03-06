import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import useGameContext from '../../hooks/useGameContext';


export default function GameOutcomeModal(
) {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const { gameState } = useGameContext();
    let msg = "";

    if (gameState.opponentInfo.resign){
        msg = "You Won!";
    } 
    else if (gameState.myInfo.resign){
        msg = "You Lose!"
    } 
    else if (gameState.myInfo.kingsState.isInStalemate || gameState.opponentInfo.kingsState.isInStalemate){
        msg = "Draw!"
    } 

  return (
    <>
    
    <Modal
        centered
        show={show || gameState.gameStatus === "FINISHED"}
        onHide={() => setShow(false)}
        >
        <Modal.Body>
            <div className="m-body">
                <h1>{msg}</h1>
                <button 
                    onClick={() => navigate("/lobby")}
                    className='btn btn-1 w-100 mt-4'>Go To Lobby</button>
            </div>
        </Modal.Body>
        </Modal>
    </>
  )
}

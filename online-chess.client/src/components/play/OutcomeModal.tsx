import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { GameStatus } from '../../game/utilities/constants';
import { useNavigate } from 'react-router';

interface IOutcomeModal{
    // show: boolean;
    // playerWon: boolean;
    // draw: boolean;
    outcome: GameStatus | null;
}

export default function OutcomeModal(
    { outcome }: IOutcomeModal
) {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    let msg = "";

    if (outcome === null){
        msg = "";
    }
    else if (outcome === GameStatus.Won){
        msg = "You Won!";
    } 
    else if (outcome === GameStatus.Lose){
        msg = "You Lose!"
    } 
    else if (outcome === GameStatus.Draw){
        msg = "Draw!"
    } 

  return (
    <>
    
    <Modal
        centered
        show={outcome !== null || show}
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

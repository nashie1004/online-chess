import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import useGameContext from '../../hooks/useGameContext';
import useGameUIHandlerContext from '../../hooks/useGameUIHandlerContext';
import { setImage } from '../../utils/helper';


export default function GameOutcomeModal(
) {
    const navigate = useNavigate();
    const { gameState } = useGameContext();
    const { 
        gameOverMessage, showGameOverModal, setShowGameOverModal 
    } = useGameUIHandlerContext();
  
  return (
    <>
    
    <Modal
        centered
        show={showGameOverModal}
        onHide={() => setShowGameOverModal(false)}
        >
        <Modal.Body>
            <div className="m-header">
                <h5>{gameOverMessage}</h5>
            </div>
            <div className="m-body game-over-modal">
                <div className='d-flex justify-content-around'>
                    <div className='d-flex flex-column align-items-center gap-2'>
                        <img src={setImage(gameState.myInfo.profileImageUrl)} alt="player-1" loading='lazy' />
                        <p className='text-white'>{gameState.myInfo.userName} (You)</p>
                    </div>
                    <div className='d-flex align-items-center'>
                        <p className='text-white'>vs</p>
                    </div>
                    <div className='d-flex flex-column align-items-center gap-2'>
                        <img src={setImage(gameState.opponentInfo.profileImageUrl)} alt="player-2" loading='lazy' />
                        <p className='text-white'>{gameState.opponentInfo.userName}</p>
                    </div>
                </div>
                <button 
                    onClick={() => navigate("/")}
                    className='btn btn-1 w-100 mt-4'>See Leaderboards</button>
            </div>
            <div className="m-footer"></div>
        </Modal.Body>
        </Modal>
    </>
  )
}

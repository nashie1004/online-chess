import { pieceImages, PieceNames } from '../../game/utilities/constants';
import useGameContext from '../../hooks/useGameContext';

export default function CaptureHistory() {
    
    const { gameState } = useGameContext();
  
    console.log("capture history: ", gameState.captureHistory)

    return (
    <>
        
        <div className='hstack'>
            {gameState.captureHistory.map((capture, idx) => {
                const name = capture.uniqueName?.split("-")[0] as PieceNames
                const svgUrl = `data:image/svg+xml;base64,${btoa(pieceImages[name])}`;
                return <div key={idx}>
                    <img 
                        src={svgUrl} 
                        alt={capture.uniqueName} 
                        style={{ width: 35, height: 35, }} 
                    />
                </div>
            })}
        </div>
        {/* <div className='hstack'>
            {gameState.captureHistory.black.map((capture, idx) => {
                const name = capture.pieceName.split("-")[0] as PieceNames
                const svgUrl = `data:image/svg+xml;base64,${btoa(pieceImages[name])}`;
                return <div key={idx}>
                    <img 
                        src={svgUrl} 
                        alt={capture.pieceName} 
                        style={{ width: 35, height: 35, }} 
                    />
                </div>
            })}
        </div> */}
    </>
  )
}

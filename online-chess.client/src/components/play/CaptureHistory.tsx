import usePhaserContext from '../../hooks/usePhaserContext';
import { pieceImages, PieceNames } from '../../game/utilities/constants';

export default function CaptureHistory() {
  
      const {
          captureHistory,
      } = usePhaserContext();
  
    return (
    <>
        
        <div className='hstack'>
            {captureHistory.white.map((capture, idx) => {
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
        </div>
        <div className='hstack'>
            {captureHistory.black.map((capture, idx) => {
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
        </div>
    </>
  )
}

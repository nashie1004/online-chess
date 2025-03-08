import { useCallback } from 'react';
import { PieceNames } from '../../game/utilities/constants';
import useGameContext from '../../hooks/useGameContext';
import useUserPreferenceContext from '../../hooks/useUserPreferenceContext';

export default function CaptureHistory() {
    const { gameState } = useGameContext();
    const { pieceUI } = useUserPreferenceContext();
    
    const piecePath = `/src/assets/pieces/${pieceUI}/`;
  
    const imgFn = useCallback((piece: PieceNames) => {
        let firstTwoChars = piece.slice(0, 2);

        if (firstTwoChars === "wK"){
            firstTwoChars = "wN";
        } else if (firstTwoChars === "bK"){
            firstTwoChars = "bN";
        }

        return `${piecePath}${firstTwoChars}.svg`;
    }, [pieceUI]);

    return (
    <>
        <div className='hstack'>
            {gameState.captureHistory.map((capture, idx) => {
                const name = capture.uniqueName?.split("-")[0] as PieceNames
                const imgSrc = imgFn(name);

                return <div key={idx}>
                    <img 
                        src={imgSrc} 
                        alt={capture.uniqueName} 
                        style={{ width: 35, height: 35, }} 
                    />
                </div>
            })}
        </div>
    </>
  )
}

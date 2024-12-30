import { useEffect } from 'react';
import usePhaser from '../hooks/usePhaser';
import { pieceImages, PieceNames } from '../utils/constants';
import { chessBoardNotation } from '../utils/helpers';
import useReactContext from '../hooks/useReactContext';
import { IReactContext } from '../utils/types';

const board = chessBoardNotation();

export default function SidebarLeft() {
    const {
        isWhitesTurn,
        moveHistory,
        captureHistory,
        kingsState,
    } = usePhaser();
    const {timer, setTimer} = useReactContext();

    useEffect(() => {
        let intervalId: number;

        if (isWhitesTurn){
            intervalId = setInterval(() => {
                setTimer(prev => ({ ...prev, white: prev.white + 1 }));
            }, 1000)
        } else {
            intervalId = setInterval(() => {
                setTimer(prev => ({ ...prev, black: prev.black + 1 }));
            }, 1000)
        }

        return () => {
            clearInterval(intervalId);
        }
    }, [isWhitesTurn])

    return (
    <aside id="sidebar-left" className='p-4 d-flex justify-content-center align-items-center'>
        <div className='p-4 border bg-dark-subtle border-secondary rounded-end' style={{ width: "100%" }} >
            <div className="alert alert-success" role="alert">
                <h6 className='text-center'>White: {timer.white} seconds</h6>
                <h6 className='text-center'>Black: {timer.black} seconds</h6>
            </div>
            <div className="alert alert-success" role="alert">
                {kingsState.black.isInCheck ? <h6 className='text-center'>Black is in check</h6> : <></> }
                {kingsState.white.isInCheck ? <h6 className='text-center'>White is in check</h6> : <></> }
                {kingsState.black.isCheckMate ? <h6 className='text-center'>Black is checkmated</h6> : <></> }
                {kingsState.white.isCheckMate ? <h6 className='text-center'>White is checkmated</h6> : <></> }
                <h6 className='text-center'>{isWhitesTurn ? "White" : "Black"}'s turn.</h6>
            </div>
            <h5 className='mb-3 text-center border-bottom border-secondary pb-3'>
                Move History
            </h5>
            <div style={{ height: "350px", overflowY: "scroll" }} className='border border-secondary'>
                <table className='table table-sm'>
                    <thead>
                        <tr className=''>
                            <th scope='col'>#</th>
                            <th scope='col'>White</th>
                            <th scope='col'>Black</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Get the maximum number of moves for white and black */}
                        {Array.from({ length: Math.max(moveHistory.white.length, moveHistory.black.length) }).map((_, idx) => (
                            <tr key={idx}>
                            <th scope='row'>{idx + 1}</th>
                            {/* Display white's move if it exists */}
                            <td>{moveHistory.white[idx] ? board[moveHistory.white[idx].new.x][moveHistory.white[idx].new.y] : '-'}</td>
                            {/* Display black's move if it exists */}
                            <td>{moveHistory.black[idx] ? board[moveHistory.black[idx].new.x][moveHistory.black[idx].new.y] : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <h5 className='mb-3 text-center border-bottom border-secondary py-3'>
                Captures
            </h5>
            <div className='d-flex bg-body-tertiary p-2'>
                <div>
                    {captureHistory.white.map((capture, idx) => {
                        const name = capture.pieceName.split("-")[0] as PieceNames
                        const svgUrl = `data:image/svg+xml;base64,${btoa(pieceImages[name])}`;
                        return <>
                            <img 
                                key={idx}
                                src={svgUrl} 
                                alt={capture.pieceName} 
                                style={{ width: 35, height: 35, }} 
                            />
                        </>
                    })}
                </div>
                <div>
                    {captureHistory.black.map((capture, idx) => {
                        const name = capture.pieceName.split("-")[0] as PieceNames
                        const svgUrl = `data:image/svg+xml;base64,${btoa(pieceImages[name])}`;
                        return <>
                            <img 
                                key={idx}
                                src={svgUrl} 
                                alt={capture.pieceName} 
                                style={{ width: 35, height: 35, }} 
                            />
                        </>
                    })}
                </div>
            </div>
        </div>       
    </aside>
  )
}

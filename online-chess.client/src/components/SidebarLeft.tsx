import usePhaser from '../hooks/usePhaser';
import { pieceImages, PieceNames } from '../utils/constants';
import { chessBoardNotation } from '../utils/helpers';

const board = chessBoardNotation();

export default function SidebarLeft() {
    const {
        isWhitesTurn,
        moveHistory,
        captureHistory
    } = usePhaser();

    return (
    <aside id="sidebar-left" className='p-4 d-flex justify-content-center align-items-center'>
        <div className='p-4 border bg-dark-subtle border-secondary rounded-end' style={{ width: "100%" }} >
            <div className="alert alert-light bg-success" role="alert">
                <h4 className='text-center'>
                    {isWhitesTurn ? "White" : "Black"}'s turn.
                </h4>
            </div>
            <h5 className='mb-3 text-center border-bottom border-secondary pb-3'>
                Move History
            </h5>
            <div style={{ height: "350px", overflowY: "scroll" }} className='px-4 py-3 border border-secondary'>
                <table className='table table-sm table-striped'>
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
            <h6>White:</h6>
            <ul className='d-flex'>
                {captureHistory.white.map((capture, idx) => {
                    const name = capture.pieceName.split("-")[0] as PieceNames
                    const svgUrl = `data:image/svg+xml;base64,${btoa(pieceImages[name])}`;
                    return <>
                        <img 
                            key={idx}
                            src={svgUrl} 
                            alt={capture.pieceName} 
                            style={{ width: 50, height: 50, }} 
                        />
                    </>
                })}
            </ul>
            <h5>Black:</h5>
            <ul className='d-flex'>
                {captureHistory.black.map((capture, idx) => {
                    const name = capture.pieceName.split("-")[0] as PieceNames
                    const svgUrl = `data:image/svg+xml;base64,${btoa(pieceImages[name])}`;
                    return <div className='p-2'>
                        <img 
                            key={idx}
                            src={svgUrl} 
                            alt={capture.pieceName} 
                            style={{ width: 50, height: 50, }} 
                        />
                    </div>
                })}
            </ul>
        </div>       
    </aside>
  )
}

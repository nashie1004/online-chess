import usePhaser from '../hooks/usePhaser';
import { chessBoardNotation } from '../utils/helpers';

const board = chessBoardNotation();

export default function Sidebar() {
    const {
        isWhitesTurn,
        moveHistory,
        captureHistory
    } = usePhaser();

    return (


    <aside id="sidebar-left" className='p-4'>
            <div className="alert alert-light" role="alert">
                <h2 className='text-center'>
                    {isWhitesTurn ? "White" : "Black"} turn.
                </h2>
            </div>
            <hr />
            <h2>
                <span className="badge text-bg-secondary">Move History</span>
            </h2>
            <div style={{ height: "400px", overflowY: "scroll" }}>
                <table className='table'>
                    <thead>
                        <tr>
                            <th scope='col'></th>
                            <th scope='col'>White</th>
                            <th scope='col'>Black</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope='row'>1</th>
                            <td>test</td>
                            <td>test 2</td>
                        </tr>
                        <tr>
                            <th scope='row'>1</th>
                            <td>test</td>
                            <td>test 2</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <h5>White</h5>
            <ul>
                {moveHistory.white.map((move, idx) => {
                    return <li key={idx}>
                        <span>{board[move.new.x][move.new.y]}</span>
                    </li>
                })}
            </ul>
            <h5>Black</h5>
            <ul>
                {moveHistory.black.map((move, idx) => {
                    return <li key={idx}>
                        <span>{board[move.new.x][move.new.y]}</span>
                    </li>
                })}
            </ul>
            <hr />
            <h2>
                <span className="badge text-bg-secondary">Capture History</span>
            </h2>
            <h5>White</h5>
            <ul>
                {captureHistory.white.map((capture, idx) => {
                    return <li key={idx}>
                        {capture.pieceName} - {board[capture.x][capture.y]}
                    </li>
                })}
            </ul>
            <h5>Black</h5>
            <ul>
                {captureHistory.black.map((capture, idx) => {
                    return <li key={idx}>
                        {capture.pieceName} - {board[capture.x][capture.y]}
                    </li>
                })}
            </ul>
        </aside>
  )
}

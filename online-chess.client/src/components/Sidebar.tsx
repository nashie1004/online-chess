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


    <aside>
            <h2>{isWhitesTurn ? "White" : "Black"} turn.</h2>
            <hr />
            <h3>Move History</h3>
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
            <h3>Capture History</h3>
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

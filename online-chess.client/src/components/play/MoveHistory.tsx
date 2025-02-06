import { chessBoardNotation } from '../../game/utilities/helpers';
import { Table } from 'react-bootstrap';
import useGameContext from '../../hooks/useGameContext';
import { useEffect, useRef } from 'react';

const board = chessBoardNotation();

export default function MoveHistory() {
    const { gameState } = useGameContext();
    const moveHistory = gameState.moveHistory;
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current){
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [gameState.moveHistory]);

  return (
    <>
        <div ref={containerRef} style={{ height: "170px", overflowY: "scroll", scrollBehavior: "smooth" }} className='mb-3 mt-4'>
            <Table striped size="sm">
                <tbody>
                    {Array.from({ length: Math.max(gameState.moveHistory.white.length, gameState.moveHistory.black.length) }).map((_, idx) => (
                        <tr key={idx}>
                            <td className={idx % 2 === 0 ? "stripe-td table-row-no" : "table-row-no"}>{idx + 1}</td>
                            <td className={idx % 2 === 0 ? "stripe-td" : ""}>
                                {moveHistory.white[idx] ? board[moveHistory.white[idx].new.x][moveHistory.white[idx].new.y] : '-'}
                            </td>
                            <td className={idx % 2 === 0 ? "stripe-td" : ""}>{
                                moveHistory.black[idx] ? board[moveHistory.black[idx].new.x][moveHistory.black[idx].new.y] : '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    </>
  )
}

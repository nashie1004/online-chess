import React from 'react'
import usePhaserContext from '../../hooks/usePhaserContext';
import { chessBoardNotation } from '../../game/utilities/helpers';
import { Table } from 'react-bootstrap';

const board = chessBoardNotation();

export default function MoveHistory() {
    const {
        moveHistory,
        captureHistory,
        setPromoteTo,
        isColorWhite
    } = usePhaserContext();
    
  return (
    <>
        <div style={{ height: "170px", overflowY: "scroll" }} className='mb-3 mt-4'>
            <Table striped size="sm">
                {/* <thead>
                    <tr>
                        <th></th>
                        <th>White</th>
                        <th>Black</th>
                    </tr>
                </thead> */}
                <tbody>
                    {Array.from({ length: Math.max(moveHistory.white.length, moveHistory.black.length) }).map((_, idx) => (
                        <tr key={idx}>
                            <td className={idx % 2 === 0 ? "stripe-td table-row-no" : "table-row-no"}>{idx + 1}</td>
                            <td className={idx % 2 === 0 ? "stripe-td" : ""}>{moveHistory.white[idx] ? board[moveHistory.white[idx].new.x][moveHistory.white[idx].new.y] : '-'}</td>
                            <td className={idx % 2 === 0 ? "stripe-td" : ""}>{moveHistory.black[idx] ? board[moveHistory.black[idx].new.x][moveHistory.black[idx].new.y] : '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    </>
  )
}

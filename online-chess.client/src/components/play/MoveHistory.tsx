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
        <div style={{ height: "170px", overflowY: "scroll" }} className='mb-3'>
            <Table striped size="sm">
                <thead>
                    <tr>
                        <th></th>
                        <th>White</th>
                        <th>Black</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: Math.max(moveHistory.white.length, moveHistory.black.length) }).map((_, idx) => (
                        <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{moveHistory.white[idx] ? board[moveHistory.white[idx].new.x][moveHistory.white[idx].new.y] : '-'}</td>
                            <td>{moveHistory.black[idx] ? board[moveHistory.black[idx].new.x][moveHistory.black[idx].new.y] : '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    </>
  )
}

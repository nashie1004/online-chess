import usePhaser from '../hooks/usePhaser';
import { pieceImages, PieceNames } from '../game/utilities/constants';
import { chessBoardNotation } from '../game/utilities/helpers';
import { eventEmitter } from '../game/utilities/eventEmitter';

import wQueen from "../assets/pieces/wQ.svg"
import wRook from "../assets/pieces/wR.svg"
import wBishop from "../assets/pieces/wB.svg"
import wKnight from "../assets/pieces/Wn.svg"

import bRook from "../assets/pieces/bR.svg"
import bKnight from "../assets/pieces/bN.svg"
import bBishop from "../assets/pieces/bB.svg"
import bQueen from "../assets/pieces/bQ.svg"
import { PromoteTo } from '../game/utilities/types';

const board = chessBoardNotation();

interface IPiece{
  key: PromoteTo;
  path: string
}

export default function SidebarLeft() {
    const {
        moveHistory,
        captureHistory,
        setPromoteTo,
        isColorWhite
    } = usePhaser();
    
    const pieces: IPiece[] = [
    { key: "rook", path: isColorWhite ? wRook : bRook },
    { key: "knight", path: isColorWhite ? wKnight : bKnight },
    { key: "bishop", path: isColorWhite ? wBishop : bBishop },
    { key: "queen", path: isColorWhite ? wQueen : bQueen },
    ];
    
    return (
    <aside className='flex-1 p-4'>
    
      <div className='' style={{ border: "1px solid rgba(177, 158, 191, 0.2)"}}>

      <div className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md">Game Configuration</p>
        </div>
      </div>
      <div>
        {/* <RadioGroup defaultValue="queen"  label="Promote pawn to:" orientation="horizontal" className='flex'>
          {
            pieces.map((piece, idx) => {
              return <Radio 
                className='flex-1'
                key={idx} 
                value={piece.key}
                onClick={() => {
                  setPromoteTo(piece.key);
                  eventEmitter.emit("setPromoteTo", piece.key);
                }}
                >
                {piece.key}
              </Radio>
            })
          }
        </RadioGroup> */}
        <div className="flex gap-2">
          <button className='flex-1' color='secondary'>Request a Draw</button>
          <button className='flex-1' color="danger">Resign</button>
        </div>
      </div>
    </div>
    <div className='bg-default-50' style={{ border: "1px solid rgba(177, 158, 191, 0.2)"}}>
      <div className="flex gap-3">
          <p className="">Move History</p>
      </div>
      <div>
        <div>
            <div style={{ height: "200px", overflowY: "scroll" }}>
                <div aria-label="Example static collection div" >
                    <div>
                        <div>#</div>
                        <div>WHITE</div>
                        <div>BLACK</div>
                    </div>
                    <div>
                        {Array.from({ length: Math.max(moveHistory.white.length, moveHistory.black.length) }).map((_, idx) => (
                            <div key={idx}>
                                <div>{idx + 1}</div>
                                <div>{moveHistory.white[idx] ? board[moveHistory.white[idx].new.x][moveHistory.white[idx].new.y] : '-'}</div>
                                <div>{moveHistory.black[idx] ? board[moveHistory.black[idx].new.x][moveHistory.black[idx].new.y] : '-'}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>   
    <div className=' bg-default-50' style={{ border: "1px solid rgba(177, 158, 191, 0.2)"}}>
        <div>
            <p>Capture History</p>
        </div>
        <div>
            <div style={{ height: "100px", overflowY: "scroll" }}>
              <div className='flex gap-4 p-3'>
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
            </div>
        </div>
    </div>
    </aside>
  )
}

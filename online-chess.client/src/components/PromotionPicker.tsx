import wQueen from "../assets/pieces/wQ.svg"
import wRook from "../assets/pieces/wR.svg"
import wBishop from "../assets/pieces/wB.svg"
import wKnight from "../assets/pieces/Wn.svg"

import bRook from "../assets/pieces/bR.svg"
import bKnight from "../assets/pieces/bN.svg"
import bBishop from "../assets/pieces/bB.svg"
import bQueen from "../assets/pieces/bQ.svg"

import { PromoteTo } from "../utils/types"
import usePhaser from "../hooks/usePhaser"
import { eventEmitter } from "../phaser/eventEmitter"

interface IPiece{
  key: PromoteTo;
  path: string
}

export default function PromotionPicker() {
  const { isColorWhite, promoteTo, setPromoteTo } = usePhaser();

  const pieces: IPiece[] = [
    { key: "rook", path: isColorWhite ? wRook : bRook },
    { key: "knight", path: isColorWhite ? wKnight : bKnight },
    { key: "bishop", path: isColorWhite ? wBishop : bBishop },
    { key: "queen", path: isColorWhite ? wQueen : bQueen },
  ];

  return (
    <div>
      <h3>Promote To: {promoteTo}</h3>
      {
        pieces.map((piece, idx) => {
          return <button 
            className="btn btn-primary"
            key={idx} 
            onClick={() => {
              setPromoteTo(piece.key);
              eventEmitter.emit("setPromoteTo", piece.key);
            }}>
            {piece.key}
            {/* <img src={piece.path} alt={piece.key} style={{ width: 50, height: 50, }}  /> */}
          </button>
        })
      }
    </div>
  )
}

import React from 'react'
import Chatbar from './Chatbar'
import PromotionPicker from './PromotionPicker'
import usePhaser from '../hooks/usePhaser';
import { eventEmitter } from '../phaser/eventEmitter';
import { PromoteTo } from '../utils/types';
import wQueen from "../assets/pieces/wQ.svg"
import wRook from "../assets/pieces/wR.svg"
import wBishop from "../assets/pieces/wB.svg"
import wKnight from "../assets/pieces/Wn.svg"

import bRook from "../assets/pieces/bR.svg"
import bKnight from "../assets/pieces/bN.svg"
import bBishop from "../assets/pieces/bB.svg"
import bQueen from "../assets/pieces/bQ.svg"
import { ButtonGroup, Button, RangeCalendar } from '@nextui-org/react';


interface IPiece{
  key: PromoteTo;
  path: string
}

export default function SidebarRight() {
  const { isColorWhite, promoteTo, setPromoteTo } = usePhaser();

  const pieces: IPiece[] = [
    { key: "rook", path: isColorWhite ? wRook : bRook },
    { key: "knight", path: isColorWhite ? wKnight : bKnight },
    { key: "bishop", path: isColorWhite ? wBishop : bBishop },
    { key: "queen", path: isColorWhite ? wQueen : bQueen },
  ];

  return (
    <div id="sidebar-right"  
      className='p-4 d-flex justify-content-center align-items-center'>
      <div className='p-4 border bg-dark-subtle border-secondary rounded-end' style={{ width: "100%" }} >
        
      <h5 className='mb-3 text-center border-bottom border-secondary pb-3'>
        Actions
      </h5>
      <Button color="primary" className="font-sans" style={{ fontFamily: "Inter"}}>Button</Button>
  <h1 className='font-mono'>
    Hello world!
  </h1>
  <p>Lorem, ipsum dolor.</p>
  <RangeCalendar />
  
      <ButtonGroup>
        <Button className='font-sans'>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
      <h6>Promote pawn to:</h6>
      <div className="btn-group mb-3 d-flex" role="group" aria-label="Basic outlined example">
      {
        pieces.map((piece, idx) => {
          return <button 
            type="button"
            className={promoteTo === piece.key ? "btn btn-primary" : "btn btn-outline-primary"}
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
        <div className="btn-group btn-group-lg mb-3 d-flex" role="group" aria-label="Large button group">
          <button type="button" className="btn btn-success">Draw</button>
          <button type="button" className="btn btn-danger">Resign</button>
        </div>
        <h5 className='mb-3 text-center border-bottom border-secondary pb-3'>
            Chat bar
        </h5>
        <ul style={{ height: "350px", overflowY: "scroll" }} className='list-group rounded-top border border-secondary'>
          <li className="list-group-item">Lorem ipsum dolor sit amet.</li>
          <li className="list-group-item">Lorem ipsum dolor sit amet.</li>
          <li className="list-group-item">Lorem ipsum dolor sit amet.</li>
        </ul>
        
        <div className="input-group mb-3">
          <input type="text" className="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="button-addon2" />
          <button className="btn btn-secondary" type="button" id="button-addon2">Button</button>
        </div>


      </div>  
    </div>
  )
}

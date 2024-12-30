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
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Button, Select, SelectItem, Spacer, ButtonGroup} from "@nextui-org/react";


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
         <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
        <Image
          alt="nextui logo"
          height={40}
          radius="sm"
          src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-md">Game Configuration</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <h1>Game Config</h1>
        <Spacer y={3} />
        <Select
            className="max-w-xs"
            defaultSelectedKeys={["queen"]}
            label="Promote to"
            placeholder="Queen"
          >
              {
                pieces.map((piece, idx) => {
                  return <SelectItem  
                    key={idx} 
                    className="max-w-xs"
                    onPress={() => {
                      setPromoteTo(piece.key);
                      eventEmitter.emit("setPromoteTo", piece.key);
                    }}>
                    {piece.key}
                    {/* <img src={piece.path} alt={piece.key} style={{ width: 50, height: 50, }}  /> */}
                  </SelectItem>
                })
            }
        </Select>
        <Spacer y={2} />
        <div className="flex">
          <Button size="md">Draw</Button>
          <Button size="md" color="danger">Request a Draw</Button>
        </div>
      </CardBody>
    </Card>
    </div>
  )
}

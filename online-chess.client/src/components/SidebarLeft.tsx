import usePhaser from '../hooks/usePhaser';
import { pieceImages, PieceNames } from '../game/utilities/constants';
import { chessBoardNotation } from '../game/utilities/helpers';
import {Card, CardHeader, CardBody,  Divider, Image, ScrollShadow, Spacer, Kbd, Button, Select, SelectItem, Radio, RadioGroup} from "@nextui-org/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";
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
    
      <Card className='' style={{ border: "1px solid rgba(177, 158, 191, 0.2)"}}>

      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md">Game Configuration</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <RadioGroup defaultValue="queen"  label="Promote pawn to:" orientation="horizontal" className='flex'>
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
        </RadioGroup>
        <Spacer y={4} />
        <div className="flex gap-2">
          <Button size="md" className='flex-1' color='secondary'>Request a Draw</Button>
          <Button size="md" className='flex-1' color="danger">Resign</Button>
        </div>
      </CardBody>
    </Card>
    <Spacer y={5} />
    <Card className='bg-default-50' style={{ border: "1px solid rgba(177, 158, 191, 0.2)"}}>
      <CardHeader className="flex gap-3">
          <p className="">Move History</p>
      </CardHeader>
      <Divider />
      <CardBody>
        <ScrollShadow>
            <div style={{ height: "200px", overflowY: "scroll" }}>
                <Table aria-label="Example static collection table" isStriped>
                    <TableHeader>
                        <TableColumn>#</TableColumn>
                        <TableColumn>WHITE</TableColumn>
                        <TableColumn>BLACK</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: Math.max(moveHistory.white.length, moveHistory.black.length) }).map((_, idx) => (
                            <TableRow key={idx}>
                                <TableCell scope='row'>{idx + 1}</TableCell>
                                <TableCell>{moveHistory.white[idx] ? board[moveHistory.white[idx].new.x][moveHistory.white[idx].new.y] : '-'}</TableCell>
                                <TableCell>{moveHistory.black[idx] ? board[moveHistory.black[idx].new.x][moveHistory.black[idx].new.y] : '-'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </ScrollShadow>
      </CardBody>
    </Card>   
    <Spacer y={5} />
    <Card className=' bg-default-50' style={{ border: "1px solid rgba(177, 158, 191, 0.2)"}}>
        <CardHeader>
            <p>Capture History</p>
        </CardHeader>
        <Divider />
        <CardBody>
            <div style={{ height: "100px", overflowY: "scroll" }}>
              <div className='flex gap-4 p-3'>
                  {captureHistory.white.map((capture, idx) => {
                      const name = capture.pieceName.split("-")[0] as PieceNames
                      const svgUrl = `data:image/svg+xml;base64,${btoa(pieceImages[name])}`;
                      return <Kbd key={idx}>
                          <Image 
                              src={svgUrl} 
                              alt={capture.pieceName} 
                              style={{ width: 35, height: 35, }} 
                          />
                      </Kbd>
                  })}
                  {captureHistory.black.map((capture, idx) => {
                      const name = capture.pieceName.split("-")[0] as PieceNames
                      const svgUrl = `data:image/svg+xml;base64,${btoa(pieceImages[name])}`;
                      return <Kbd key={idx}>
                          <Image 
                              src={svgUrl} 
                              alt={capture.pieceName} 
                              style={{ width: 35, height: 35, }} 
                          />
                      </Kbd>
                  })}
              </div>
            </div>
        </CardBody>
    </Card>
    </aside>
  )
}

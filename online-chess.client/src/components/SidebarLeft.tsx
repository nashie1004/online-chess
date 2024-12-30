import { useEffect } from 'react';
import usePhaser from '../hooks/usePhaser';
import { pieceImages, PieceNames } from '../utils/constants';
import { chessBoardNotation } from '../utils/helpers';
import useReactContext from '../hooks/useReactContext';
import { IReactContext } from '../utils/types';
// import { Card, CardHeader, Divider, CardBody, CardFooter } from '@nextui-org/react';
// import { Link } from 'react-router';
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, ScrollShadow, Spacer, Kbd} from "@nextui-org/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";

const board = chessBoardNotation();

export default function SidebarLeft() {
    const {
        isWhitesTurn,
        moveHistory,
        captureHistory,
        kingsState,
    } = usePhaser();
    
    return (
    <aside id="sidebar-left" className='p-4 d-flex justify-content-center align-items-center'>
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
          <p className="text-md">Game History</p>
          <p className="text-small text-default-500">Move and Capture History</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <h2 className='mt-2'>Move History</h2>
        <ScrollShadow>
            <div style={{ height: "350px", overflowY: "scroll" }}>
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
        <Spacer y={4}  />
        <Divider />
        <h2 className='mt-2'>Capture History</h2>
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
      </CardBody>
    </Card>   
    </aside>
  )
}

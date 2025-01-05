import usePhaser from '../hooks/usePhaser';
import PlayerInfo from './ui/PlayerInfo';
import MailIcon from './ui/MainInfo';
import { Alert, Button, Form, Table } from 'react-bootstrap';
import Chatbar from './Chatbar';
import CaptureHistory from './CaptureHistory';
import MoveHistory from './MoveHistory';

export default function SidebarRight() {
  const { isColorWhite, promoteTo, setPromoteTo } = usePhaser();

  return (
      <div className=''>
        {/* 1. Resign, Request draw btns */}
        <div className='hstack gap-1 mt-3'>
          <button className='btn btn-danger btn-md w-100'>Resign</button>
          <button className='btn btn-secondary btn-md w-100'>Offer a Draw</button>
        </div>
        {/* 2. Game checks, checkmate, stalemate, player turn */}
        <h6 className='text-bg-dark p-1 rounded-2 text-center my-2'>Player Information</h6>
        <PlayerInfo />
        {/* 3. Move History */}
        <h6 className='text-bg-dark p-1 rounded-2 text-center my-2'>Move History</h6>
        <MoveHistory />
        {/* 4. Capture History */}
        {/* <h6 className='text-bg-dark p-1 rounded-2 text-center my-2'>Capture History</h6>
        <CaptureHistory /> */}
        {/* 5. Chat bar */}
        <h6 className='text-bg-dark p-1 rounded-2 text-center my-2'>Chat Bar</h6>
        <Chatbar />
      </div>
  )
}

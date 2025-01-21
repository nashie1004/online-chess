import usePhaserContext from '../../hooks/usePhaserContext';
import PlayerInfo from './PlayerInfo';
import Chatbar from './Chatbar';
import MoveHistory from './MoveHistory';
import GameOutcome from './GameOutcome';

export default function SidebarRight() {
    const { isColorWhite, promoteTo, setPromoteTo } = usePhaserContext();

  return (
    <div className='' id="sidebarRight">
      <div className="table-title">
        <h5 className="">GAME INFORMATION</h5>
      </div>
      <div className='sidebar-right-body'>
        <GameOutcome />
        <PlayerInfo />
        <h5 className='border-bottom border-secondary pb-2 my-2'>Move History</h5>
        <MoveHistory />
        <h5 className='border-bottom border-secondary pb-2 my-2'>Chat Bar</h5>
        <Chatbar />
      </div>
    </div>
  )
}

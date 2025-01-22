import usePhaserContext from '../../hooks/usePhaserContext';
import PlayerInfo from './PlayerInfo';
import Chatbar from './Chatbar';
import MoveHistory from './MoveHistory';
import GameOutcome from './GameOutcome';

export default function SidebarRight() {
    const { isColorWhite, promoteTo, setPromoteTo } = usePhaserContext();

  return (
    <div className='sidebar vstack'>
      <div className="sidebar-header hstack justify-content-center">
        <h4 className="">
          <i className="bi bi-lightning-charge-fill"  style={{ color: "#FFEB3B", fontSize: "1.6rem" }}></i> BLITZ 3 MINUTES
        </h4>
      </div>
      <div className='sidebar-body-1'>
        <GameOutcome />
        <PlayerInfo />
      </div>
      <div className="sidebar-body-2">
        <MoveHistory />
      </div>
      <div className="sidebar-footer">
        <div className='hstack justify-content-left ps-2 sidebar-bar'>
          <i className="bi bi-chat-fill ps-2" style={{color: "#A8A8A7", fontSize: "1.5rem"}}></i>
          <span style={{ color: "#F5F5F5"}}>&nbsp; Chat</span>
        </div>
        <Chatbar />
      </div>
    </div>
  )
}

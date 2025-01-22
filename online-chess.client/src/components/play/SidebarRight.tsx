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
      <div className='sidebar-body'>
        <GameOutcome />
        <PlayerInfo />
        <MoveHistory />
      </div>
      <div className="sidebar-footer">
        <div className='hstack justify-content-left'>
          <i className="bi bi-chat-fill ps-2" style={{color: "#373633", fontSize: "1.5rem"}}></i>
        </div>
        <Chatbar />
      </div>
    </div>
  )
}

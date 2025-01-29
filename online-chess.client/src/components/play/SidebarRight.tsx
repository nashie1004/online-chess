import PlayerInfo from './PlayerInfo';
import Chatbar from './Chatbar';
import MoveHistory from './MoveHistory';
import GameOutcome from './GameOutcome';
import useGameContext from '../../hooks/useGameContext';
import { GameType } from '../../game/utilities/constants';

export default function SidebarRight() {
  const { gameState } = useGameContext();

  function gameDisplay(){
    switch(gameState.gameType){
      case GameType.Classical:
        return <>
          <i className="bi bi-hourglass"  style={{ color: "#FFEB3B", fontSize: "1.6rem" }}></i> CLASSICAL 1 HOUR
        </>
      case GameType.Blitz3Mins:
        return <>
          <i className="bi bi-fire"  style={{ color: "#FFEB3B", fontSize: "1.6rem" }}></i> BLITZ 3 MINUTES
        </>
      case GameType.Blitz5Mins:
        return <>
          <i className="bi bi-fire"  style={{ color: "#FFEB3B", fontSize: "1.6rem" }}></i> BLITZ 5 MINUTES
        </>
      case GameType.Rapid10Mins:
        return <>
          <i className="bi bi-lightning-charge-fill"  style={{ color: "#FFEB3B", fontSize: "1.6rem" }}></i> RAPID 10 MINUTES
        </>
      case GameType.Rapid25Mins:
        return <>
          <i className="bi bi-lightning-charge-fill"  style={{ color: "#FFEB3B", fontSize: "1.6rem" }}></i> RAPID 25 MINUTES
        </>
    }
  }

  return (
    <div className='sidebar vstack'>
      <div className="sidebar-header hstack justify-content-center">
      <h4 className="">{gameDisplay()}</h4>
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

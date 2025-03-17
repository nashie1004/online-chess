import GameTypeTable from "../components/home/GameTypeTable";
import MainLeaderboardTable from "../components/home/MainLeaderboardTable";
import { GameType } from "../game/utilities/constants";

export default function Home() {
  
  return (
    <div className="col pb-5">
      <MainLeaderboardTable />
      <GameTypeTable 
        gameType={GameType.Classical} 
        gameTypeLabel="CLASSICAL" 
        icon="bi bi-hourglass" 
      />
      <GameTypeTable 
        gameType={GameType.Blitz3Mins} 
        gameTypeLabel="BLITZ" 
        icon="bi bi-fire" 
      />
      <GameTypeTable 
        gameType={GameType.Rapid10Mins} 
        gameTypeLabel="RAPID" 
        icon="bi bi-lightning-charge-fill" 
      />
    </div>
  );
}

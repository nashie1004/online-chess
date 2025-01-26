import GameTypeTable from "../components/home/GameTypeTable";
import MainLeaderboardTable from "../components/home/MainLeaderboardTable";
import { GameType } from "../game/utilities/constants";

export default function Home() {
  
  return (
    <div className="col pb-5">
      <MainLeaderboardTable />
      <GameTypeTable 
        gameType={GameType.Classical} 
        gameTypeLabel="Classical" 
        icon="bi bi-lightning-charge-fill" 
      />
      <GameTypeTable 
        gameType={GameType.Rapid10Mins} 
        gameTypeLabel="Rapid" 
        icon="bi bi-lightning-charge-fill" 
      />
    </div>
  );
}

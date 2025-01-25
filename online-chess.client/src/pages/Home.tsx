import GameTypeTable from "../components/home/GameTypeTable";
import MainLeaderboardTable from "../components/home/MainLeaderboardTable";
import { GameType } from "../game/utilities/constants";

export default function Home() {
  
  return (
    <div className="col pb-5">
      <MainLeaderboardTable />
      <GameTypeTable 
        gameType={GameType.Classical} 
        gameTypeLabel="Blitz" 
        icon="bi bi-trophy-fill" 
      />
    </div>
  );
}

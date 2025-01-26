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
        icon="bi bi-hourglass" 
      />
      {/** Blitz 3 and 5 mins */}
      <GameTypeTable 
        gameType={GameType.Blitz3Mins} 
        gameTypeLabel="Blitz" 
        icon="bi bi-fire" 
      />
      {/** Rapid 10 and 25 mins */}
      <GameTypeTable 
        gameType={GameType.Rapid10Mins} 
        gameTypeLabel="Rapid" 
        icon="bi bi-lightning-charge-fill" 
      />
    </div>
  );
}

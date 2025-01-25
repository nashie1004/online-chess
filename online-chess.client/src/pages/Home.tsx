import BlitzTable from "../components/home/BlitzTable";
import ClassicalTable from "../components/home/ClassicalTable";
import MainLeaderboardTable from "../components/home/MainLeaderboardTable";
import RapidTable from "../components/home/RapidTable";

export default function Home() {
  
  return (
    <div className="col pb-5">
      <MainLeaderboardTable />
      <BlitzTable />
      <RapidTable />
      <ClassicalTable />
    </div>
  );
}

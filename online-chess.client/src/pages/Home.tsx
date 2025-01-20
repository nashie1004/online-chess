import moment from "moment";
import { useEffect, useState } from "react";
import { Pagination, Spinner, Table } from "react-bootstrap";
import BaseApiService from "../services/BaseApiService";
import { toast } from "react-toastify";
import { ILeaderboardList } from "../game/utilities/types";

const baseApiService = new BaseApiService();

export default function Home() {
  const [pageNo, setPageNo] = useState<number>(1);
  const [list, setList] = useState<ILeaderboardList>({
    isLoading: true, data: []
  });

  async function getData(){
    setList({ isLoading: true, data: [] });

    const res = await baseApiService.baseGetList("/api/Home/Leaderboard", {
      pageSize: 10,
      pageNumber: pageNo,
      sortBy: "",
      filters: ""
    });

    if (!res.isOk){
      toast(res.message, { type: "error" })
      return;
    }

    setList({ isLoading: false, data: res.data.leaderboardList });
  }

  useEffect(() => {
    getData();
  }, [pageNo])

  return (
    <div className="col">
      <h3 className="mt-5">Leaderboard</h3>
      <Table responsive >
      <thead>
        <tr>
          <th className="col-1">#</th>
          <th className="col-3">Player Username</th>
          <th className="col-2">Wins</th>
          <th className="col-2">Loses</th>
          <th className="col-2">Draw</th>
          <th className="col-2">Last Game Date</th>
        </tr>
      </thead>
      <tbody>
        {list.isLoading ? <>
          <Spinner animation="border" variant="dark" className="mt-3" /> 
        </> : <>
          {list.data.map((item, idx) => {
            return <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{item.userName}</td>
              <td>{item.wins === 0 ? "-" : item.wins}</td>
              <td>{item.loses === 0 ? "-" : item.loses}</td>
              <td>{item.draws === 0 ? "-" : item.draws}</td>
              <td>{moment(item.lastGameDate).fromNow()}</td>
            </tr>
          })}
        </>}
      </tbody>
      </Table>
      <Pagination>
        <Pagination.Prev 
          disabled={pageNo === 1}
          onClick={() => {
            setPageNo(prev => Math.max(prev - 1, 1));
          }}
        />
        <Pagination.Item disabled>{pageNo}</Pagination.Item>
        <Pagination.Next 
          onClick={() => {
            setPageNo(prev => prev + 1);
          }}
        />
      </Pagination>
    </div>
  );
}

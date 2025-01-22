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
      <div className="table-title hstack gap-2 align-items-center mt-5 mb-3">
        <i className="bi bi-trophy-fill" style={{ color: "#FFEB3B", fontSize: "1.5rem" }}></i>
        <h4 className="ps-2">LEADERBOARD</h4>
      </div>
      <div className="sidebar-right-body">

      </div>
      <Table responsive >
      <thead>
        <tr>
          <th className="col-1">
          <i className="bi bi-bar-chart-fill" style={{ color: "#FFFFFF",  }}></i>
          </th>
          <th className="col-3">
            <i className="bi bi-person-fill" style={{color: "#FFFFFF"}}></i> Best Players
          </th>
          <th className="col-2">
            <i className="bi bi-check-lg" style={{color: "#FFFFFF"}}></i> Wins 
          </th>
          <th className="col-2">
            <i className="bi bi-x-circle" style={{color: "#B36D7C"}}></i> Loses 
          </th>
          <th className="col-2">
            <i className="bi bi-dash" style={{color: "#FFFFFF"}}></i> Draw 
          </th>
          <th className="col-2">
            <i className="bi bi-calendar2-fill" style={{color: "#FFFFFF"}}></i> Last Game Date 
          </th>
        </tr>
      </thead>
      <tbody>
        {list.isLoading ? <>
          <Spinner animation="border" variant="dark" className="mt-3" /> 
        </> : <>
          {list.data.map((item, idx) => {
            return <tr key={idx}>
              <td >
                #{idx + 1}
              </td>
              <td>{item.userName}</td>
              <td className="table-win">{item.wins === 0 ? "0" : item.wins}</td>
              <td className="table-lose">{item.loses === 0 ? "0" : item.loses}</td>
              <td className="table-draw">{item.draws === 0 ? "0" : item.draws}</td>
              <td>{moment(item.lastGameDate).fromNow()}</td>
            </tr>
          })}
        </>}
      </tbody>
      </Table>
      <div className="table-footer">
        <ul className="table-pagination">
          <li
            className="skip-end"
            onClick={() => {
              setPageNo(prev => Math.max(prev - 1, 1));
            }}
          >
            <i className="bi bi-skip-start-fill" ></i>
          </li>
          <li className="page-no">{pageNo}</li>
          <li
            className="skip-start"
            onClick={() => {
              setPageNo(prev => prev + 1);
            }}
          >
            <i className="bi bi-skip-end-fill" ></i>
          </li>
        </ul>
      </div>
    </div>
  );
}

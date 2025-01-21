import moment from "moment"
import { useEffect, useState } from "react"
import { Table, Pagination, Spinner } from "react-bootstrap"
import { toast } from "react-toastify";
import { IGameHistoryList } from "../../game/utilities/types";
import BaseApiService from "../../services/BaseApiService";
import { gameStatusDisplay } from "../../utils/helper";

const baseApiService = new BaseApiService();

export default function ProfileTable(){
  const [pageNo, setPageNo] = useState<number>(1);
  const [list, setList] = useState<IGameHistoryList>({
    isLoading: true, data: []
  });
  
  async function getData(){
    setList({ isLoading: true, data: [] });

    const res = await baseApiService.baseGetList("/api/Auth/gameHistory", {
      pageSize: 10,
      pageNumber: pageNo,
      sortBy: "",
      filters: ""
    });

    if (!res.isOk){
      toast(res.message, { type: "error" })
      return;
    }

    setList({ isLoading: false, data: res.data.items });
  }
  
  useEffect(() => {
    getData();
  }, [pageNo])

    return <>
    <div className="table-title">
     <h5 className="">GAME HISTORY</h5>
    </div>
    <Table responsive striped size="sm">
      <thead>
        <tr>
          <th className="col-1">
            <i className="bi bi-hash" style={{ color: "#FFFFFF",  }}></i>
          </th>
          <th className="col-2">
            <i className="bi bi-circle-fill"  style={{ color: "#FFFFFF",  }}></i> Game Status
          </th>
          <th className="col-2">
            <i className="bi bi-circle-half"  style={{ color: "#FFFFFF",  }}></i> Color
          </th>
          <th className="col-4">
            <i className="bi bi-person"  style={{ color: "#FFFFFF",  }}></i> Opponent
          </th>
          <th className="col-3">
            <i className="bi bi-calendar2-fill" style={{color: "#FFFFFF"}}></i> Date 

          </th>
        </tr>
      </thead>
      <tbody>
        {list.isLoading ? <>
          <Spinner animation="border" variant="dark" className="mt-3" /> 
        </> : list.data.map((item, idx) => {
          return <tr key={idx}>
            <td>{idx + 1}</td>
            <td>{gameStatusDisplay(item.gameStatus)}</td>
            <td>{item.isColorWhite ? "White" : "Black"}</td>
            {/* <td>{item.opponentName}</td> */}
            <td>Lorem, ipsum dolor.</td>
            <td>{moment(item.createDate).format("M/D/YYYY h:mmA")}</td>
          </tr>
        })}
      </tbody>
      </Table>
      <div>
        <ul className="pagination-select">
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
    </>
}
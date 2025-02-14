import moment from "moment"
import { useEffect, useState } from "react"
import { Table, Spinner } from "react-bootstrap"
import { toast } from "react-toastify";
import { IGameHistoryList } from "../../game/utilities/types";
import { GenericReturnMessageList } from "../../services/BaseApiService";
import { gameStatusDisplay, gameTypeDisplay } from "../../utils/helper";
import useSignalRContext from "../../hooks/useSignalRContext";
import { listHandlers, listInvokers } from "../../game/utilities/constants";

export default function ProfileTable(){
  const [pageNo, setPageNo] = useState<number>(1);
  const [list, setList] = useState<IGameHistoryList>({ isLoading: true, data: [] });
  const { addHandler, removeHandler, invoke, userConnectionId } = useSignalRContext();

  useEffect(() => {
    if (!userConnectionId) return;
  
    async function init(){
      await addHandler(listHandlers.onGetGameHistory, (res: GenericReturnMessageList) => {
        if (!res.isSuccess){
          toast(res.validationErrors.join(","), { type: "error" })
          return;
        }
        
        setList({ isLoading: false, data: res.items });
      });
    }

    init();
    
    return () => {
      removeHandler(listHandlers.onGetGameHistory);
    };
  }, [userConnectionId]);
  
  useEffect(() => {
    if (!userConnectionId) return;

    setList({ isLoading: true, data: [] });
    invoke(listInvokers.gameHistory, 10, pageNo);
  }, [pageNo, userConnectionId]);

  return <>
    <div className="table-title">
     <h5 className="">
      <i className="bi bi-clock-history" style={{ color: "#FFFFFF", fontSize: "1.5rem" }}></i>
      <span className="ps-2">GAME HISTORY</span>
     </h5>
    </div>
    <Table responsive striped size="sm">
      <thead>
        <tr>
          <th className="col-1">
            <i className="bi bi-hash" style={{ color: "#FFFFFF",  }}></i>
          </th>
          <th className="col-2">
            <i className="bi bi-question-circle"  style={{ color: "#FFFFFF",  }}></i> Game Status
          </th>
          <th className="col-1">
            <i className="bi bi-circle-half"  style={{ color: "#FFFFFF",  }}></i> Color
          </th>
          <th className="col-3">
            <i className="bi bi-hourglass"  style={{ color: "#FFFFFF",  }}></i> Game Type
          </th>
          <th className="col-3">
            <i className="bi bi-person"  style={{ color: "#FFFFFF",  }}></i> Opponent
          </th>
          <th className="col-2">
            <i className="bi bi-calendar2-fill" style={{color: "#FFFFFF"}}></i> Date 
          </th>
        </tr>
      </thead>
      <tbody>
        {list.isLoading ? <>
          <Spinner animation="border" variant="light" size="sm" className="my-2" /> 
        </> : list.data.map((item, idx) => {

          return <tr key={idx}>
            <td>{item.indexNo}</td>
            <td>{gameStatusDisplay(item.gameStatus)}</td>
            <td>{item.isColorWhite ? "White" : "Black"}</td>
            <td>{gameTypeDisplay(item.gameType)}</td>
            <td>{item.opponentName}</td>
            <td>{moment(item.gameDate).fromNow()}</td>
          </tr>
        })}
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
            <i className="bi bi-skip-start-fill" style={{ color: "#A8A8A7", fontSize: "1.35rem" }}  ></i>
          </li>
          <li className="page-no">
            {pageNo}
          </li>
          <li
            className="skip-start"
            onClick={() => {
              setPageNo(prev => prev + 1);
            }}
          >
            <i className="bi bi-skip-end-fill" style={{ color: "#A8A8A7", fontSize: "1.35rem" }} ></i>
          </li>
        </ul>
      </div>
    </>
}
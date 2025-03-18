import moment from "moment"
import { useEffect, useState } from "react"
import { Table, Spinner } from "react-bootstrap"
import { IGameHistoryList } from "../../game/utilities/types";
import { GenericReturnMessageList } from "../../services/BaseApiService";
import { gameStatusDisplay, gameTypeDisplay, setImage } from "../../utils/helper";
import useSignalRContext from "../../hooks/useSignalRContext";
import useNotificationContext from "../../hooks/useNotificationContext";
import { LIST_INVOKERS } from "../../constants/invokers";
import { LIST_HANDLERS } from "../../constants/handlers";

export default function ProfileTable(){
  const [pageNo, setPageNo] = useState<number>(1);
  const [list, setList] = useState<IGameHistoryList>({ isLoading: true, data: [] });
  const { addHandler, removeHandler, invoke, userConnectionId } = useSignalRContext();
  const { setNotificationState } = useNotificationContext();

  useEffect(() => {
    if (!userConnectionId) return;
  
    async function init(){
      await addHandler(LIST_HANDLERS.ON_GET_GAME_HISTORY, (res: GenericReturnMessageList) => {
        if (!res.isSuccess){
          setNotificationState({ 
            type: "SET_CUSTOMMESSAGE"
            , payload: { customMessage: res.validationErrors.join(","), customMessageType: "DANGER" } 
          });
          return;
        }
        
        setList({ isLoading: false, data: res.items });
      });
    }

    init();
    
    return () => {
      removeHandler(LIST_HANDLERS.ON_GET_GAME_HISTORY);
    };
  }, [userConnectionId]);
  
  useEffect(() => {
    if (!userConnectionId) return;

    setList({ isLoading: true, data: [] });
    invoke(LIST_INVOKERS.GAME_HISTORY, 10, pageNo);
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
            <i className="bi bi-person"  style={{ color: "#FFFFFF",  }}></i> Opponent
          </th>
          <th className="col-1">
            <i className="bi bi-question-circle"  style={{ color: "#FFFFFF",  }}></i> Status
          </th>
          <th className="col-1">
            <i className="bi bi-circle-half"  style={{ color: "#FFFFFF",  }}></i> Color
          </th>
          <th className="col-2">
            <i className="bi bi-hourglass"  style={{ color: "#FFFFFF",  }}></i> Game Type
          </th>
          <th className="col-1">
            <i className="bi bi-calendar2-fill" style={{color: "#FFFFFF"}}></i> Date 
          </th>
          <th className="col-2">
            <i className="bi bi-pencil-fill" style={{color: "#FFFFFF"}}></i> Remarks 
          </th>
        </tr>
      </thead>
      <tbody>
        {list.isLoading ? <>
          <Spinner animation="border" variant="light" size="sm" className="my-2" /> 
        </> : list.data.map((item, idx) => {

          return <tr key={idx}>
            <td>{item.indexNo}</td>
            <td>
              <img src={setImage(item.profileImageUrl)} className='profile-img small' alt="player-img" loading="lazy" />
              <span className="ps-2">{item.opponentName}</span>
            </td>
            <td>{gameStatusDisplay(item.gameStatus)}</td>
            <td>{item.isColorWhite ? "White" : "Black"}</td>
            <td>{gameTypeDisplay(item.gameType)}</td>
            <td>{moment(item.gameDate).local().fromNow()}</td>
            <td>{item.remarks}</td>
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
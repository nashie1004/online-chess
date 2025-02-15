import moment from "moment";
import { useState, useEffect, useMemo } from "react";
import { Table, Spinner } from "react-bootstrap";
import { IGameTypeList } from "../../game/utilities/types";
import { GenericReturnMessageList } from "../../services/BaseApiService";
import { GameType, listHandlers, listInvokers,  } from "../../game/utilities/constants";
import useSignalRContext from "../../hooks/useSignalRContext";
import useNotificationContext from "../../hooks/useNotificationContext";

interface IGameTypeTable{
  gameTypeLabel: string;
  icon: string;
  gameType: GameType
}

export default function GameTypeTable(
  { gameTypeLabel, icon, gameType } : IGameTypeTable
){
    const [pageNo, setPageNo] = useState<number>(1);
    const [list, setList] = useState<IGameTypeList>({ isLoading: true, data: [] });
    const { addHandler, removeHandler, invoke, userConnectionId } = useSignalRContext();
    const { setNotificationState } = useNotificationContext();

    const listHandler = useMemo(() => {
      switch(gameType){
        case GameType.Classical:
          return listHandlers.onGetGameTypeListClassical;
        case GameType.Blitz3Mins:
          return listHandlers.onGetGameTypeListBlitz3Mins;
        case GameType.Blitz5Mins:
          return listHandlers.onGetGameTypeListBlitz5Mins;
        case GameType.Rapid10Mins:
          return listHandlers.onGetGameTypeListRapid10Mins;
        case GameType.Rapid25Mins:
          return listHandlers.onGetGameTypeListRapid25Mins;
        default: 
          return "";
      }
    }, []);

    useEffect(() => {
      if (!userConnectionId) return;

      async function init(){
        await addHandler(listHandler, (res: GenericReturnMessageList) => {
          if (!res.isSuccess){
            setNotificationState({ 
              type: "SET_CUSTOMMESSAGE"
              , payload: { 
                customMessage: res.validationErrors.join(",")
                , customMessageType: "DANGER" 
              } 
            });
            return;
          }
          
          setList({ isLoading: false, data: res.items });
        });
      }

      init();

      return () => {
        removeHandler(listHandler);
      };
    }, [userConnectionId]);

    useEffect(() => {
      if (!userConnectionId) return;

      setList({ isLoading: true, data: [] });
      invoke(listInvokers.gameTypeList, 10, pageNo, gameType);
    }, [pageNo, userConnectionId]);

    return <>
    
    <div className="table-title hstack gap-2 align-items-center mt-5 mb-3">
        <i className={icon} style={{ color: "#FFEB3B", fontSize: "1.5rem" }}></i>
        <h4 className="ps-2">{gameTypeLabel}</h4>
      </div>
      <Table responsive size="lg">
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
            <Spinner animation="border" variant="light" size="sm" className="my-2" /> 
          </> : <>
            {list.data.map((item, idx) => {
              let rankColor = "ps-3";

              switch(item.rank){
                case 1:
                  rankColor = "rank-1";
                  break;
                case 2:
                  rankColor = "rank-2";
                  break;
                case 3:
                  rankColor = "rank-3";
                  break;
                default:
                  break;
              }

              return <tr key={idx}>
                <td>
                  <div 
                    className={rankColor}
                  >
                    #{item.rank}
                  </div>
                </td>
                <td>{item.username}</td>
                <td className="table-win">{item.wins === 0 ? "-" : item.wins}</td>
                <td className="table-lose">{item.loses === 0 ? "-" : item.loses}</td>
                <td className="table-draw">{item.draws === 0 ? "-" : item.draws}</td>
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
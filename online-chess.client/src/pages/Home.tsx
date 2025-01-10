import moment from "moment";
import { Pagination, Table } from "react-bootstrap";

export default function Home() {
  const tempLengthLeaderboard = 5;
  const tempLength = 4;

  return (
    <div className="col">
      <h3 className="mt-5">Leaderboard</h3>
      <Table responsive striped size="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Player Username</th>
          <th>Wins</th>
          <th>Loses</th>
          <th>Draw</th>
          <th>Last Game Date</th>
        </tr>
      </thead>
      <tbody>
        {
          Array.from({length: 4}).map((item, idx) => {
            return <tr key={idx}>
              <td>{idx}.</td>
              <td>Lorem, ipsum dolor.</td>
              <td>Lorem, ipsum dolor.</td>
              <td>Lorem, ipsum dolor.</td>
              <td>Lorem, ipsum dolor.</td>
              <td>{moment(new Date()).fromNow()}</td>
            </tr>
          })
        }
      </tbody>
      </Table>
      <Pagination>
        <Pagination.Prev />
        <Pagination.Item disabled>{1}</Pagination.Item>
        <Pagination.Next />
      </Pagination>
    </div>
  );
}

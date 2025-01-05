import { Pagination, Table } from "react-bootstrap";

export default function Home() {
  const tempLengthLeaderboard = 5;
  const tempLength = 4;

  return (
    <>
      <h2 className="mt-5">Leaderboard</h2>
      <Table responsive striped size="sm">
      <thead>
        <tr>
          <th></th>
          <th>Player Username</th>
          <th>Wins</th>
          <th>Loses</th>
          <th>Draw</th>
          <th>Last Game Date</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          {Array.from({ length: tempLengthLeaderboard }).map((_, index) => (
            <td key={index}>Table cell {index}</td>
          ))}
        </tr>
        <tr>
          <td>1</td>
          {Array.from({ length: tempLengthLeaderboard }).map((_, index) => (
            <td key={index}>Table cell {index}</td>
          ))}
        </tr>
        <tr>
          <td>1</td>
          {Array.from({ length: tempLengthLeaderboard }).map((_, index) => (
            <td key={index}>Table cell {index}</td>
          ))}
        </tr>
        <tr>
          <td>1</td>
          {Array.from({ length: tempLengthLeaderboard }).map((_, index) => (
            <td key={index}>Table cell {index}</td>
          ))}
        </tr>
        <tr>
          <td>1</td>
          {Array.from({ length: tempLengthLeaderboard }).map((_, index) => (
            <td key={index}>Table cell {index}</td>
          ))}
        </tr>
        <tr>
          <td>1</td>
          {Array.from({ length: tempLengthLeaderboard }).map((_, index) => (
            <td key={index}>Table cell {index}</td>
          ))}
        </tr>
        <tr>
          <td>1</td>
          {Array.from({ length: tempLengthLeaderboard }).map((_, index) => (
            <td key={index}>Table cell {index}</td>
          ))}
        </tr>
        <tr>
          <td>1</td>
          {Array.from({ length: tempLengthLeaderboard }).map((_, index) => (
            <td key={index}>Table cell {index}</td>
          ))}
        </tr>
        <tr>
          <td>2</td>
          {Array.from({ length: tempLengthLeaderboard }).map((_, index) => (
            <td key={index}>Table cell {index}</td>
          ))}
        </tr>
        <tr>
          <td>3</td>
          {Array.from({ length: tempLengthLeaderboard }).map((_, index) => (
            <td key={index}>Table cell {index}</td>
          ))}
        </tr>
      </tbody>
      </Table>
      <Pagination>
        <Pagination.Prev />
        <Pagination.Item disabled>{1}</Pagination.Item>
        <Pagination.Next />
      </Pagination>
    </>
  );
}

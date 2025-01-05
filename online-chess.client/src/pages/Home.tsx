import { Table } from "react-bootstrap";

export default function Home() {
  return (
    <div>
      <h2>Leaderboard</h2>
      <Table responsive striped>
      <thead>
        <tr>
          <th>#</th>
          {Array.from({ length: 4 }).map((_, index) => (
            <th key={index}>Table heading</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          {Array.from({ length: 4 }).map((_, index) => (
            <td key={index}>Table cell {index}</td>
          ))}
        </tr>
        <tr>
          <td>2</td>
          {Array.from({ length: 4 }).map((_, index) => (
            <td key={index}>Table cell {index}</td>
          ))}
        </tr>
        <tr>
          <td>3</td>
          {Array.from({ length: 4 }).map((_, index) => (
            <td key={index}>Table cell {index}</td>
          ))}
        </tr>
      </tbody>
      </Table>
    </div>
  );
}

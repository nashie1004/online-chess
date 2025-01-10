import moment from "moment"
import { Table, Pagination } from "react-bootstrap"

export default function ProfileTable(){
    return <>
    <Table responsive striped size="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Game Status</th>
          <th>Color</th>
          <th>Opponent</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {
          Array.from({length: 4}).map((item, idx) => {
            return <tr key={idx}>
              <td>{idx + 1}.</td>
              <td>Won</td>
              <td>White</td>
              <td>Opponent Name</td>
              <td>{moment().format("M/D/YYYY h:mmA")}</td>
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
    </>
}
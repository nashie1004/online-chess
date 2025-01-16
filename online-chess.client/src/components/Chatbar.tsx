import { Table, Form } from "react-bootstrap";
import useReactContext from "../hooks/useGameContext";
import moment from "moment";

export default function Chatbar() {
  const {messages} = useReactContext();

  return (
    <>
      <div style={{ height: "250px", overflowY: "scroll" }}>
          <Table striped size="sm">
            <tbody>
              {messages.map((item, idx) => {
                return <tr key={idx}>
                  <p>{item.createdByUser}: {item.message} - {moment(item.createDate).fromNow()}</p>
                </tr>
              })}
            </tbody>
          </Table>
        </div>
        <Form onSubmit={e => e.preventDefault()} className='hstack gap-1'>
          <input type="text" className='form-control' placeholder='Your Message' />
          <button className='btn btn-outline-primary' type='submit'>Send</button>
        </Form>
    </>
  )
}

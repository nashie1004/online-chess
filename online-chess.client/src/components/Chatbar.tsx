import { Table, Form } from "react-bootstrap";
import useReactContext from "../hooks/useGameContext";
import moment from "moment";
import useSignalRContext from "../hooks/useSignalRContext";
import { useState } from "react";
import useGameContext from "../hooks/useGameContext";

export default function Chatbar() {
  const {messages} = useReactContext();
  const { gameRoomKey } = useGameContext();
  const { invoke } = useSignalRContext();
  const [message, setMessage] = useState("");

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    invoke("AddMessageToRoom", gameRoomKey, message)
    setMessage("");
  }

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
        <Form onSubmit={submitForm} className='hstack gap-1'>
          <input 
            type="text" 
            className='form-control' 
            placeholder='Your Message' 
            onChange={e => setMessage(e.target.value)}
            value={message} />
          <button className='btn btn-outline-primary' type='submit'>Send</button>
        </Form>
    </>
  )
}

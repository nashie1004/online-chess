import { Table, Form } from "react-bootstrap";

export default function Chatbar() {
  return (
    <>
      <div style={{ height: "250px", overflowY: "scroll" }}>
          <Table striped size="sm">
            <tbody>
              <tr>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Architecto, cumque.</p>
              </tr>
              <tr>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Architecto, cumque.</p>
              </tr>
              <tr>
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eius non itaque adipisci unde soluta magni.</p>
              </tr>
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

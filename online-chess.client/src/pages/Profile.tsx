import { Form, Table } from "react-bootstrap";

export default function Profile() {
  return (
    <div>
      <h3 className="text-large">Account Information</h3>
      <div className="mb-3 w-25">
        <Form
            onSubmit={(e) => e.preventDefault()}
          >
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter Username" 
                disabled readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Enter Password" 
                disabled readOnly
                />
            </Form.Group>
            <Form.Check  
              type="checkbox"
              label="Edit Profile"
            />
        </Form>
      </div>
      <h3 className="text-large">Game History</h3>
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

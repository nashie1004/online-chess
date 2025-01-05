import { Form, Pagination, Table } from "react-bootstrap";

export default function Profile() {
  const tempLength = 4;

  return (
    <>
      <div className="mt-5 mt-3 w-50">
        <h3 className="">Account Information</h3>
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
            <button disabled className="btn btn-primary w-100 mt-3">Edit</button>
        </Form>
      </div>
      <h3 className="my-3">Game History</h3>
      <Table responsive striped size="sm">
      <thead>
        <tr>
          <th>#</th>
          {Array.from({ length: tempLength }).map((_, index) => (
            <th key={index}>Table heading</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          {Array.from({ length: tempLength }).map((_, index) => (
            <td key={index}>Table cell {index}</td>
          ))}
        </tr>
        <tr>
          <td>2</td>
          {Array.from({ length: tempLength }).map((_, index) => (
            <td key={index}>Table cell {index}</td>
          ))}
        </tr>
        <tr>
          <td>3</td>
          {Array.from({ length: tempLength }).map((_, index) => (
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

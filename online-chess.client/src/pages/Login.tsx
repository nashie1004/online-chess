import { Button, Card, Form } from "react-bootstrap";
import { NavLink } from "react-router";

export default function Login() {
  const onSubmit = () => {

  }

  return (
    <Card className="w-50">
      <Card.Header>
        <h3>Sign in to your account</h3>
        <NavLink to="/register" className="nav-link text-primary">Or Register</NavLink>
      </Card.Header>
      <Card.Body>
        <Form
          onSubmit={onSubmit}
        >
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter Username" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter Password" />
          </Form.Group>
          <div className="d-flex">
            <Button className="w-50" type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}


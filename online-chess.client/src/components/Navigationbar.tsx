import { NavLink,  useNavigate, useSearchParams, useLocation } from 'react-router'
import Navbar from 'react-bootstrap/Navbar';
import { Button, Container, Nav } from 'react-bootstrap';

export const AcmeLogo = () => {
    return (
      <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
        <path
          clipRule="evenodd"
          d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    );
  };
  
export default function NavigationBar() {
    const url = useLocation();
  const navigate = useNavigate();

  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand>ONLINE-CHESS.COM</Navbar.Brand>
        <Nav className='me-auto'>
          {
            [
              { url: "/", name: "Home" },
              { url: "/play", name: "Play" },
              { url: "/profile", name: "Profile" },
              { url: "/login", name: "Login" },
              { url: "/register", name: "Register" },
            ].map((item, idx) => {
              return  (
                <NavLink key={idx} to={item.url} className={url.pathname === item.url ? "nav-link active" : "nav-link"}>
                  {item.name}
                </NavLink>
              )
            })
          }
        </Nav>
        <Nav>
          <NavLink className="nav-link" to="/">
            Log out
          </NavLink>
          <NavLink className="btn btn-outline-warning"
           to="https://github.com/nashie1004/online-chess"
          >
            Source code
          </NavLink>
        </Nav>
      </Container>
    </Navbar>
  )
}

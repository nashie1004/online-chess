import { NavLink, useLocation } from 'react-router'
import Navbar from 'react-bootstrap/Navbar';
import { Container, Nav } from 'react-bootstrap';
import useAuthContext from '../hooks/useAuthContext';
  
export default function NavigationBar() {
    const url = useLocation();
  const {isAuthenticated, logout} = useAuthContext();

  return (
    <Navbar bg="dark" data-bs-theme="dark" collapseOnSelect expand="lg">
      <Container>
        <Navbar.Brand>ONLINE-CHESS.COM</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className='me-auto'>
            {
              // Not Signed In
              !isAuthenticated ?
              [
                { url: "/", name: "Home",  },
                { url: "/login", name: "Login",  },
                { url: "/register", name: "Register",  },
                { url: "/about", name: "About",  },
              ].map((item, idx) => {
                return  (
                  <NavLink key={idx} to={item.url} className={url.pathname === item.url ? "nav-link active" : "nav-link"}>
                    {item.name}
                  </NavLink>
                )
              }) 
              // Signed In
              :
              [
                { url: "/", name: "Home",  },
                { url: "/play", name: "Play",  },
                { url: "/profile", name: "Profile",  },
                { url: "/about", name: "About",  },
              ].map((item, idx) => {
                return  (
                  <NavLink key={idx} to={item.url} className={url.pathname === item.url ? "nav-link active" : "nav-link"}>
                    {item.name}
                  </NavLink>
                )
              })
            }
          </Nav>
          <Nav className='hstack gap-2'>
            {
              isAuthenticated ?
                <button 
                  onClick={() => logout()}
                  className='btn btn-outline-info'>
                  Log out
                </button>
              : <></>
            }
            <NavLink className="btn btn-outline-warning"
            to="https://github.com/nashie1004/online-chess"
            >
              Source code
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

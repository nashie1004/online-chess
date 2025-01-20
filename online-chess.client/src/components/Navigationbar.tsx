import { NavLink, useLocation } from 'react-router'
import Navbar from 'react-bootstrap/Navbar';
import { Container, Nav } from 'react-bootstrap';
import useAuthContext from '../hooks/useAuthContext';
  
export default function NavigationBar() {
    const url = useLocation();
  const {logout, user} = useAuthContext();
  
  return (
    <Navbar bg="dark" data-bs-theme="dark" collapseOnSelect expand="lg" id="navbar">
      <Container>
        <Navbar.Brand>ONLINE-CHESS.COM</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className='me-auto'>
            {
              // Not Signed In
              !user ?
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
                { url: "/lobby", name: "Lobby",  },
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
            <NavLink to="https://github.com/nashie1004/online-chess" className="text-warning nav-link">Source Code</NavLink>
          </Nav>
          <Nav className='hstack gap-2'>
            {
              user ?
              <>
                <span className="text-white">{user.userName}</span>
                <button 
                  onClick={() => logout()}
                  className='btn btn-outline-info'>
                  Log out
                </button>
              </>
              : <span className="text-white">Guest</span>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

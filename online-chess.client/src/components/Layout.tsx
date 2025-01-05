import { Outlet, useLocation, useNavigate } from "react-router";
import Navbar from "./Navigationbar";
import useAuthContext from "../hooks/useAuthContext";
import { useEffect } from "react";
import { Spinner } from "react-bootstrap";

export default function Layout() {
    const navigate = useNavigate();
    const url = useLocation();
    const {isAuthenticated, isAuthenticating} = useAuthContext();
      // if not signed in, allowed urls are these
    const unAuthenticatedAllowedPaths = ["/", "/about", "/register", "/login"];

    useEffect(() => {

      if (isAuthenticated) return;

      if (!unAuthenticatedAllowedPaths.includes(url.pathname)) {
        navigate('/login');
      }

    }, [isAuthenticated, url.pathname])

  return (
    <>
      <Navbar />
      <main className="container d-flex justify-content-center align-items-start flex-grow-1">
        {
        !isAuthenticating ? 
          <div className="row w-100">
            <Outlet />
          </div> 
          : 
          <Spinner animation="border" variant="dark" className="mt-3" /> 
        }
      </main>
    </>
  );
}

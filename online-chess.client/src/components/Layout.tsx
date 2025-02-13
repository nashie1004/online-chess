import { Outlet, useLocation, useNavigate } from "react-router";
import Navbar from "./Navigationbar";
import useAuthContext from "../hooks/useAuthContext";
import { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import GameAlert from "./GameAlert";

export default function Layout() {
    const navigate = useNavigate();
    const url = useLocation();
    const {user, isAuthenticating} = useAuthContext();
      // if not signed in, allowed urls are these
    const unAuthenticatedAllowedPaths = ["/", "/about", "/register", "/login"];

    useEffect(() => {
      if (user) return;

      if (!unAuthenticatedAllowedPaths.includes(url.pathname)) {
        navigate('/login');
      }

    }, [user, url.pathname])

  return (
    <>
      <Navbar />
      <GameAlert />
      <main className="container d-flex justify-content-center align-items-start flex-grow-1">
        {
        !isAuthenticating ? 
          <div className="row w-100">
            <Outlet />
          </div> 
          : 
          <Spinner animation="border" variant="light" className="mt-3" /> 
        }
      </main>

      {/** Additional */}
      
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        />
    </>
  );
}

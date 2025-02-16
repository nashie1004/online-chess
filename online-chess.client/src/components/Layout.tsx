import { Outlet, useLocation, useNavigate } from "react-router";
import Navbar from "./Navigationbar";
import useAuthContext from "../hooks/useAuthContext";
import { useEffect, useMemo } from "react";
import { Spinner } from "react-bootstrap";
import GameAlert from "./GameAlert";
import useNotificationContext from "../hooks/useNotificationContext";

export default function Layout() {
  const navigate = useNavigate();
  const url = useLocation();
  const {user, isAuthenticating} = useAuthContext();
  const { notificationState, setNotificationState } = useNotificationContext();
    // if not signed in, allowed urls are these
  const unAuthenticatedAllowedPaths = useMemo(() => ["/", "/about", "/register", "/login"], []);

  useEffect(() => {
    if (user) return;

    if (notificationState.customMessage){
      setNotificationState({ type: "SET_RESETNOTIFICATIONS" });
    }

    if (!unAuthenticatedAllowedPaths.includes(url.pathname)) {
      navigate('/login');
    }

  }, [user, url.pathname]);

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
    </>
  );
}

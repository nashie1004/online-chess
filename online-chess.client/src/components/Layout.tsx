import { Outlet } from "react-router";
import Navbar from "./Navigationbar";
import useAuthContext from "../hooks/useAuthContext";
import { Spinner } from "react-bootstrap";
import GameAlert from "./GameAlert";

export default function Layout() {
  const { isAuthenticating } = useAuthContext();

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

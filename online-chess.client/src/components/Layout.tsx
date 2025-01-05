import { Outlet } from "react-router";
import Navbar from "./Navigationbar";

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="container d-flex justify-content-center align-items-start flex-grow-1">
        <div className="row w-100">
          <Outlet />
        </div>
      </main>
    </>
  );
}

import { Outlet } from "react-router";
import Navbar from "./Navigationbar";

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}

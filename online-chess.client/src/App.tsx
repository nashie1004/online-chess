import { BrowserRouter, Route, Routes } from "react-router";
import Play from "./pages/Play";
import NotFound from "./pages/NotFound";
import GameContext from "./context/GameContext";
import './index.css'
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import 'bootstrap/dist/css/bootstrap.min.css';
import About from "./pages/About";
import AuthContext from "./context/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import Lobby from "./pages/Lobby";
import SignalRContext from "./context/SignalRContext";
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function App(){
    return <>
        <GameContext>
            <AuthContext>
                <SignalRContext>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Layout />}>
                                <Route path="/" element={<Home /> } />
                                <Route path="/play/:gameRoomId" element={<Play /> } />
                                <Route path="/register" element={<Register /> } />
                                <Route path="/login" element={<Login /> } />
                                <Route path="/profile" element={<Profile /> } />
                                <Route path="/about" element={<About /> } />
                                <Route path="/lobby" element={<Lobby /> } />
                                <Route path="*" element={<NotFound /> } />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </SignalRContext>
            </AuthContext>
        </GameContext>
    </>
}
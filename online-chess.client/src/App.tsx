import { BrowserRouter, Route, Routes } from "react-router";
import Play from "./pages/Play";
import NotFound from "./pages/NotFound";
import PhaserContext from "./context/PhaserContext";
import ReactContext from "./context/ReactContext";
import './index.css'
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import 'bootstrap/dist/css/bootstrap.min.css';
import About from "./pages/About";
import AuthContext from "./context/AuthContext";

export default function App(){
    return <>
        <ReactContext>
            <PhaserContext>
                <AuthContext>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Layout />}>
                                <Route path="/" element={<Home /> } />
                                <Route path="/play" element={<Play /> } />
                                <Route path="/register" element={<Register /> } />
                                <Route path="/login" element={<Login /> } />
                                <Route path="/profile" element={<Profile /> } />
                                <Route path="/about" element={<About /> } />
                                <Route path="*" element={<NotFound /> } />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </AuthContext>
            </PhaserContext>
        </ReactContext>
    </>
}
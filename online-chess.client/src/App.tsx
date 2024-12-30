import { BrowserRouter, Route, Routes } from "react-router";
import Play from "./pages/Play";
import NotFound from "./pages/NotFound";
import PhaserContext from "./context/PhaserContext";
import ReactContext from "./context/ReactContext";
import {NextUIProvider} from "@nextui-org/react";
import {ThemeProvider} from "next-themes"
import './output.css'
import '@fontsource/inter/400.css';  // Regular weight
import '@fontsource/inter/500.css';  // Medium weight
import '@fontsource/inter/600.css';  // Semi-bold weight
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

export default function App(){
    return <>
        <NextUIProvider>
            <ThemeProvider>
                <ReactContext>
                    <PhaserContext>
                        <BrowserRouter>
                            <Routes>
                                <Route path="/" element={<Layout />}>
                                    <Route path="/" element={<Home /> } />
                                    <Route path="/play" element={<Play /> } />
                                    <Route path="/register" element={<Register /> } />
                                    <Route path="/login" element={<Login /> } />
                                    <Route path="/profile" element={<Profile /> } />
                                    <Route path="*" element={<NotFound /> } />
                                </Route>
                            </Routes>
                        </BrowserRouter>
                    </PhaserContext>
                </ReactContext>
            </ThemeProvider>
        </NextUIProvider>
    </>
}
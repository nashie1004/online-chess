import { BrowserRouter, Route, Routes } from "react-router";
import Main from "./pages/Play";
import Play from "./pages/Play";
import NotFound from "./pages/NotFound";

export default function App(){
    return <BrowserRouter>
        <Routes>
            <Route path="/" element={<Play /> } />
            <Route path="*" element={<NotFound /> } />
        </Routes>
    </BrowserRouter>
}
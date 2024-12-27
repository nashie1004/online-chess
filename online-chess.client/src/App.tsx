import { BrowserRouter, Route, Routes } from "react-router";
import Main from "./pages/Play";
import Play from "./pages/Play";
import NotFound from "./pages/NotFound";
import PhaserContext from "./context/PhaserContext";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App(){
    return <>
        <PhaserContext>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Play /> } />
                    <Route path="*" element={<NotFound /> } />
                </Routes>
            </BrowserRouter>
        </PhaserContext>
    </>
}
import { BrowserRouter, Route, Routes } from "react-router";
import Main from "./pages/Play";
import Play from "./pages/Play";
import NotFound from "./pages/NotFound";
import PhaserContext from "./context/PhaserContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactContext from "./context/ReactContext";

export default function App(){
    return <>
        <ReactContext>
            <PhaserContext>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Play /> } />
                        <Route path="*" element={<NotFound /> } />
                    </Routes>
                </BrowserRouter>
            </PhaserContext>
        </ReactContext>
    </>
}
import { BrowserRouter, Route, Routes } from "react-router";
import Main from "./pages/Play";
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

export default function App(){
    return <>
        <NextUIProvider>
            <ThemeProvider>
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
            </ThemeProvider>
        </NextUIProvider>
    </>
}
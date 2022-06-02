import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chessgame from "./Chessgame";

export default function RouteConfig(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Chessgame/>}/>
            </Routes>
        </BrowserRouter>
    )
}
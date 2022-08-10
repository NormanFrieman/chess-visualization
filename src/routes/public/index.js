import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../../pages/Home";
import Dashboard from "../../pages/Dashboard";
import Header from "../../views/Header";
import './index.css';

export default function PublicRoutes(){
    return (
        <BrowserRouter>
            <Header />
            <div className="main_content">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    )
}
import { BrowserRouter, Routes, Route } from "react-router-dom";

function PrivateRoute() {
    return (
        <div>
            <h1>Private Route</h1>
        </div>
    )
}

export default function PrivateRoutes(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/private" element={<PrivateRoute/>}/>
            </Routes>
        </BrowserRouter>
    )
}
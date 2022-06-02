import React from "react";
import RoutesConfig from './routes/routes';
import Header from './views/Header';
import './App.css';

function App() {
    return (
        <div>
            <Header />
            <RoutesConfig/>
        </div>
    );
}

export default App;
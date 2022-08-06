import ChessComponent from "../../components/Chess";
import { Eye, EyeOff } from 'react-feather';
import './style.css';
import { useState } from "react";

function Dashboard() {
    const [showPieces, setShowPieces] = useState(true)

    return (
        <div className="container">
            <div className="chessgame">
                <ChessComponent showPieces={showPieces}/>
            </div>
            <button className="btn_display_pieces" onClick={() => setShowPieces(!showPieces)}>
                <Eye className={ showPieces ? 'img_eye_off' : 'img_eye' } color="#FFFFFF"/>
                <EyeOff className={ showPieces ? 'img_eye' : 'img_eye_off' } color="#FFFFFF"/>
            </button>
        </div>
    )
}

export default Dashboard;
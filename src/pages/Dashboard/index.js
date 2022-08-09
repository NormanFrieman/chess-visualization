import ChessComponent from "../../components/Chess";
import { Eye, EyeOff } from 'react-feather';
import './style.css';
import { useState } from "react";

function Dashboard() {
    const [showPieces, setShowPieces] = useState(true);
    const fen = '8/8/8/p7/P2k4/4p3/4K3/8 w - - 0 2';

    return (
        <div className="container">
            <div className="chessboard">
                <div className="chessgame">
                    <ChessComponent fen={fen} showPieces={showPieces}/>
                </div>
                <button className="btn_display_pieces" onClick={() => setShowPieces(!showPieces)}>
                    <Eye className={ showPieces ? 'img_eye_off' : 'img_eye' } color="#FFFFFF"/>
                    <EyeOff className={ showPieces ? 'img_eye' : 'img_eye_off' } color="#FFFFFF"/>
                </button>
            </div>
        </div>
    )
}

export default Dashboard;
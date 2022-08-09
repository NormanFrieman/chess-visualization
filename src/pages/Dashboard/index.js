import ChessComponent from "../../components/Chess";
import './style.css';
import exerc1 from '../../assets/exerc/exerc_1.js';

function Dashboard() {
    const fen = exerc1[1].split('"')[1];

    return (
        <div className="container">
            <div className="chessboard">
                <div className="chessgame">
                    <ChessComponent fen={fen} answer={exerc1[2]}/>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
import ChessComponent from "../../components/Chess";
import './style.css';

function Dashboard() {
    return (
        <div className="container">
            <div className="chessgame">
                <ChessComponent/>
            </div>
        </div>
    )
}

export default Dashboard;
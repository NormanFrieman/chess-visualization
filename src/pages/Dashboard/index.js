import { useState } from 'react';
import ChessComponent from "../../components/Chess";
import './style.css';

function getPuzzles(level){
    const tactics = require(`../../assets/exerc/pieces_${level}/tactics.js`);
    return tactics.default;
}

function Dashboard() {
    const [level, setLevel] = useState(3);
    const [exNum, setExNum] = useState(0);

    const [puzzles, setPuzzles] = useState(getPuzzles(level));
    const [fen, setFen] = useState(getFen(puzzles[exNum]));
    const [answer, setAnswer] = useState(getAnswer(puzzles[exNum]));

    function getFen(puzzle){
        return puzzle[1].split('"')[1];
    }
    
    function getAnswer(puzzle){
        return puzzle[2];
    }

    function nextPuzzle(){
        if(exNum >= puzzles.length - 1)
            return;
        
        const puzzle = puzzles[exNum + 1]
        setFen(getFen(puzzle));
        setAnswer(getAnswer(puzzle));

        setExNum(exNum + 1);
    }


    function setNextLevel(event){
        event.preventDefault();
        const auxLevel = event.target.value;
        const auxPuzzles = getPuzzles(auxLevel);

        setLevel(auxLevel);
        setPuzzles(auxPuzzles);
        setExNum(0);

        const puzzle = auxPuzzles[0]
        setFen(getFen(puzzle));
        setAnswer(getAnswer(puzzle));
    }

    return (
        <div className="container">
            <div className="chessboard">
                <div className="chessgame">
                    <ChessComponent nextPuzzle={nextPuzzle} setLevel={setNextLevel} fen={fen} answer={answer}/>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
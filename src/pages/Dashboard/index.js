import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ChessComponent from "../../components/Chess";
import './style.css';

function getPuzzles(level){
    const tactics = require(`../../assets/exerc/pieces_${level}/tactics.js`);
    return tactics.default;
}

function Dashboard() {
    const location = useLocation();
    const [level, setLevel] = useState(location.state.level);
    const [exNum, setExNum] = useState(0);

    const [puzzles, setPuzzles] = useState(getPuzzles(level));
    const [fen, setFen] = useState(getFen(puzzles[exNum]));
    const [answer, setAnswer] = useState(getAnswer(puzzles[exNum]));
    const [isEndList, setIsEndList] = useState(false);

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

        if(exNum + 1 >= puzzles.length - 1)
            setIsEndList(true);

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
        setIsEndList(false);
    }

    return (
        <div className="container">
            <div className="chessboard">
                <div className="chessgame">
                    <ChessComponent nextPuzzle={nextPuzzle} setLevel={setNextLevel} currentLevel={level} fen={fen} answer={answer} isEndList={isEndList}/>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
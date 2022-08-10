import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'react-feather';
import useSound from 'use-sound';
import move_sound from '../../assets/move-sound.mp3';

import emptyImg from '../../assets/empty-img.png';
import piecesImg from '../../helpers/piecesImg';

import './style.css';

const BlindPieces = () => {
    const namePieces = ['wK', 'bK', 'wQ', 'bQ', 'wB', 'bB', 'wN', 'bN', 'wR', 'bR', 'wP', 'bP'];
    let pieces = {};

    namePieces.forEach(namePiece => {
        pieces[namePiece] = ({ squareWidth, isDragging }) => (
            <img
                style={{
                    width: isDragging ? squareWidth * 1.75 : squareWidth,
                    height: isDragging ? squareWidth * 1.75 : squareWidth
                }}
                src={emptyImg}
                alt={"empty"}
            />
        )
    });

    return pieces;
}

const normalPieces = {};
const blindPieces = BlindPieces();

function ChessComponent(input) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(input);
    const [game, setGame] = useState(new Chess(input.fen));
    const [squaresStyles, setSquaresStyles] = useState({});
    const [moveSound] = useSound(move_sound);
    const [history, setHistory] = useState('');
    const [quantMoves, setQuantMoves] = useState(0);
    const [boardOrientation, setBoardOrientation] = useState();

    const [result, setResult] = useState('');
    const [attempt, setAttempt] = useState(true);
    const [enemyMove, setEnemyMove] = useState();

    const [showPieces, setShowPieces] = useState(false);
    
    const [piecesLocation, setPiecesLocation] = useState([]);
    const [finished, setFinished] = useState(false);
    const [endPuzzle, setEndPuzzle] = useState(false);
    const [isEndList, setIsEndList] = useState(false);
    const [currentLevel, setCurrentLevel] = useState();
    
    useEffect(() => {
        setLoading(true)
        const auxGame = new Chess(input.fen);
        const auxBoardOrientation = auxGame.turn() === 'w' ? 'white' : 'black';
        
        setData(input);
        setGame(auxGame);
        setSquaresStyles({});
        setHistory();
        setQuantMoves(0);
        setBoardOrientation(auxBoardOrientation);
        setResult('');
        setAttempt(true);
        setEnemyMove(null);
        setShowPieces(false);
        setPiecesLocation([]);
        setFinished(false);
        setEndPuzzle(false);
        setIsEndList(input.isEndList);
        setCurrentLevel(input.currentLevel);

        setTimeout(() => {
            setLoading(false);
        }, 0.05)

    }, [input]);

    // Salva a posição das peças
    useEffect(() => {
        const board = game.board();
        const newPiecesLocalition = [];

        board.forEach(column => {
            column.forEach(piece => {
                if(!piece)
                    return;
                
                newPiecesLocalition.push({
                    ...piece,
                    img: piecesImg[piece.type + piece.color]
                });
            })
        })

        setPiecesLocation(newPiecesLocalition);
    }, [game])

    function clearSquares() {
        setSquaresStyles({});
        return;
    }

    function safeMove(modify) {
        setGame(g => {
            const update = { ...g };
            modify(update);
            return update;
        })
    }

    function checkMove(sourceSquare, targetSquare){
        const answer = data.answer.split(' ');

        const auxGame = new Chess(game.fen());
        auxGame.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q'
        });

        if(answer[quantMoves] !== auxGame.history()[0]){
            if (!finished)
                setAttempt(false);
            setResult('Falhou');
            setFinished(true);
            return false;
        }
        
        return true;
    }

    function nextMove(){
        const answer = data.answer.split(' ');
        const nextEnemyMove = answer[quantMoves + 1];
        if(!nextEnemyMove && attempt){
            setResult('Correto');
            setEnemyMove(null);
            setFinished(true);
            setEndPuzzle(true);
            return;
        }

        game.move(nextEnemyMove);
        setEnemyMove(nextEnemyMove);
        setQuantMoves(quantMoves + 2);
        updateHistory();
    }

    function updateHistory(){
        let historyG = '';
        const historyGame = game.history();
        historyGame.forEach(hist => {
            historyG += hist + ' ';
        })
        setHistory(historyG);
    }

    function onDrop(sourceSquare, targetSquare) {
        let move = null;
        safeMove(game => {
            const check = checkMove(sourceSquare, targetSquare);
            if (check){
                move = game.move({
                    from: sourceSquare,
                    to: targetSquare,
                    promotion: 'q'
                });
            }
        })

        if(move === null)
            return false;
        
        updateHistory();

        moveSound();
        clearSquares();

        nextMove();
        return true;
    }

    function possiblesMoves(square){
        clearSquares();
        const squares = game.moves({ square });

        const style = {};
        squares.forEach(square => {
        if(square.length > 2)
            square = square.slice(square.length - 2);
        
        style[square] = game.square_color(square) === "light" ? 
            { backgroundColor: 'rgb(0,114,23,0.1)' } :
            { backgroundColor: 'rgb(0,114,23,0.3)' };
        });
        setSquaresStyles(style);
    }

    function squareClick(square){
        possiblesMoves(square);
    }

    function pieceDragBegin(piece, square){
        possiblesMoves(square);
    }

    return (
        <div className='container_chess'>
            <div className='container_chessboard' style={{display: !loading ? 'flex' : 'none'}}>
                <div className='container_chessboard_chessgame'>
                    <div className={ showPieces ? 'chessgame_normal' : 'chessgame_blind' }>
                        <Chessboard
                            boardOrientation={boardOrientation}
                            position={game.fen()}
                            areArrowsAllowed={false}
                            onPieceDrop={onDrop}
                            showErrors={'console'}
                            useAnimation={true}
                            onSquareClick={squareClick}
                            onPieceDragBegin={pieceDragBegin}
                            customSquareStyles={squaresStyles}
                            customPieces={normalPieces}
                        />
                    </div>
                    <div className={ showPieces ? 'chessgame_blind' : 'chessgame_normal' }>
                        <Chessboard
                            boardOrientation={boardOrientation}
                            position={game.fen()}
                            areArrowsAllowed={false}
                            onPieceDrop={onDrop}
                            showErrors={'console'}
                            useAnimation={true}
                            onSquareClick={squareClick}
                            onPieceDragBegin={pieceDragBegin}
                            customSquareStyles={squaresStyles}
                            customPieces={blindPieces}
                        />
                    </div>
                    <button className="btn_display_pieces" onClick={() => setShowPieces(!showPieces)}>
                        <Eye className={ showPieces ? 'img_eye_off' : 'img_eye' } color="#FFFFFF"/>
                        <EyeOff className={ showPieces ? 'img_eye' : 'img_eye_off' } color="#FFFFFF"/>
                    </button>
                </div>
                <div>
                    <div className='chessgame_set_puzzle'>
                        <p className='chessgame_text'>Determine a quantidade de peças:</p>
                        <select value={currentLevel} className='chessgame_select' name="level" onChange={event => data.setLevel(event)}>
                            <option value="3">3 PEÇAS</option>
                            <option value="4">4 PEÇAS</option>
                            <option value="5">5 PEÇAS</option>
                        </select>
                        <p style={{display: !endPuzzle ? 'block' : 'none' }} className='chessgame_text'>{game.turn() === 'w' ? 'Brancas jogam' : 'Pretas jogam'}</p>
                    </div>
                    <div className={ showPieces ? 'pieces_location off' : 'pieces_location' }>
                        {piecesLocation.map(pieceLocation => {
                            return (
                            <div key={pieceLocation.type + pieceLocation.square} className='piece_location'>
                                <p>{pieceLocation.square}</p>
                                <img className='img_no_piece' src={pieceLocation.img} alt='piece'/>
                            </div>)
                        })}
                    </div>
                    <div style={{display: !history ? 'none' : 'flex' }} className="chessgame_history">
                        <p>História: {history}</p>
                    </div>
                    <div style={{display: !enemyMove ? 'none' : 'flex' }} className="chessgame_enemy_move">
                        <p>{game.turn() === 'w' ? 'Pretas jogaram ' : 'Brancas jogaram '}<b>{' ' + enemyMove}</b></p>
                    </div>
                    <div style={{display: !result ? 'none' : 'flex' }} className={result && attempt ? 'chessgame_result_success' : 'chessgame_result_failed'}>
                        {result}
                    </div>
                    <div style={{display: result && !isEndList ? 'flex' : 'none' }} className="chessgame_btn">
                        <button onClick={event => data.nextPuzzle()}>PRÓXIMO DESAFIO</button>
                    </div>
                    <div style={{display: result && isEndList ? 'flex' : 'none' }} className="chessgame_end_list">
                        <div><p>NÃO HÁ MAIS EXERCÍCIOS NESSA CATEGORIA</p></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChessComponent;
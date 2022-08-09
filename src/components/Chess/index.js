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

function ChessComponent(data) {
    const [game, setGame] = useState(new Chess(data.fen));
    const [squaresStyles, setSquaresStyles] = useState({});
    const [moveSound] = useSound(move_sound);
    const [history, setHistory] = useState('');
    const [quantMoves, setQuantMoves] = useState(0);

    const [result, setResult] = useState('');
    const [attempt, setAttempt] = useState(true);
    const [enemyMove, setEnemyMove] = useState(null);

    const [showPieces, setShowPieces] = useState(false);
    
    const [piecesLocation, setPiecesLocation] = useState([]);


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
            setAttempt(false);
            setResult('Falhou');            
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
        <div className='container_chessboard'>
            <div className='container_chessboard_chessgame'>
                <div className={ showPieces ? 'chessgame_normal' : 'chessgame_blind' }>
                    <Chessboard
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
                <div style={{display: !result ? 'none' : 'flex' }} className={result && attempt ? 'chessgame_result_success' : 'chessgame_result_failed'}>
                    {result}
                </div>
                <div style={{display: !enemyMove ? 'none' : 'flex' }} className="chessgame_enemy_move">
                    <p>{game.turn() === 'w' ? 'Pretas jogaram ' : 'Brancas jogaram '}<b>{' ' + enemyMove}</b></p>
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
            </div>
        </div>
    )
}

export default ChessComponent;
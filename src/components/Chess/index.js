import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useEffect, useState } from 'react';
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

    const [piecesShow, setPiecesShow] = useState(true);
    
    const [piecesLocation, setPiecesLocation] = useState([]);

    // Define se deve exibir ou não as peças no tabuleiro
    useEffect(() => {
        if(data.showPieces){
            setPiecesShow(true);
        }else{
            setPiecesShow(false);
        }
    }, [game, piecesShow, data]);

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

    function onDrop(sourceSquare, targetSquare) {
        let move = null;
        safeMove(game => {
            move = game.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q'
            });
        })
        if(move === null)
            return false;
        
        moveSound();
        clearSquares();
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
            <div className={ piecesShow ? 'chessgame_normal' : 'chessgame_blind' }>
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
            <div className={ piecesShow ? 'chessgame_blind' : 'chessgame_normal' }>
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
            <div className='pieces_location'>
                {piecesLocation.map(pieceLocation => {
                    return (
                    <div className='piece_location'>
                        <p>{pieceLocation.square}</p>
                        <img src={pieceLocation.img} alt='piece'/>
                    </div>)
                })}
            </div>
        </div>
    )
}

export default ChessComponent;
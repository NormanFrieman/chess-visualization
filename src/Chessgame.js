import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useState } from 'react';
import useSound from 'use-sound';
import move_sound from './assets/move-sound.mp3';

function Chessgame() {
    const [game, setGame] = useState(new Chess());
    const [squaresStyles, setSquaresStyles] = useState({});
    const [moveSound] = useSound(move_sound);

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
        <div>
            <Chessboard
                position={game.fen()}
                areArrowsAllowed={false}
                onPieceDrop={onDrop}
                showErrors={'console'}
                useAnimation={true}
                onSquareClick={squareClick}
                onPieceDragBegin={pieceDragBegin}
                customSquareStyles={squaresStyles}
            />
        </div>
    )
}

export default Chessgame;
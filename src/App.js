import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useState } from 'react';
import useSound from 'use-sound';
import move_sound from './assets/move-sound.mp3';

function App() {
  const [game, setGame] = useState(new Chess());
  const [moveSound] = useSound(move_sound);

  function safeMove(modify) {
    setGame(g => {
      const update = { ...g };
      modify(update);
      return update;
    })
  }

  function test2(piece){
    console.log(piece);
    console.log("CLICOU");
  }

  function onDrop(sourceSquare, targetSquare) {
    let move = null;
    console.log(sourceSquare + " " + targetSquare);
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
    return true;
  }

  return (
    <div>
      <Chessboard
        position={game.fen()}
        // onPieceClick={test2}
        // onDragOverSquare={test2}
        onPieceDrop={onDrop}
      />;
    </div>)
}

export default App;
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

function App() {
  return (
    <div>
      <Chessboard
        draggable={true}
        position={(new Chess()).fen()}
        moveSpeed='slow'
        snapbackSpeed={500}
        snapSpeed={100}
      />;
    </div>)
}

export default App;
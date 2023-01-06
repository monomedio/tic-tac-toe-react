import { useState } from "react";

function Square({ onSquareClick, value, styleName }) {
  return (
    <button className={styleName} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ squares, xIsNext, onPlay }) {
  const handleClick = (i) => {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  };

  let winner = calculateWinner(squares);
  let winningSquares = findWinningSquares(squares);
  let status = winner
    ? winner === "nobody"
      ? "It's a draw!"
      : `The winner is ${winner}!`
    : `Next player: ${xIsNext ? "X" : "O"}`;

  // constructs an array of Square components, each conditionally styled based on the existence of a winner
  let squareComponents = Array(9)
    .fill(null)
    .map((_, index) => {
      return (
        <Square
          onSquareClick={() => handleClick(index)}
          value={squares[index]}
          key={index}
          styleName={
            winningSquares.includes(index) ? "square-winner" : "square"
          }
        />
      );
    });

  // Apparently you can nest arrays in JSX...
  // for every row (sequential three Squares) in squareComponents, wrap it in a div
  let boardRows = Array(3)
    .fill(null)
    .map((_, index) => {
      return (
        <div className="board-row" key={index}>
          {squareComponents.slice(index * 3, (index + 1) * 3)}
        </div>
      );
    });

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isReversed, setIsReversed] = useState(false);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  const handlePlay = (nextSquares) => {
    let nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  const jumpTo = (nextMove) => {
    setCurrentMove(nextMove);
  };

  const handleToggle = () => {
    setIsReversed(!isReversed);
  };

  // dynamically generates an array of buttons that visit each game state in history
  const moves = history.map((squares, move) => {
    let description = move > 0 ? `Go to move # ${move}` : `Go to game start`;
    return (
      <li key={move}>
        {move === currentMove ? (
          `You are at move # ${move}`
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  if (isReversed) {
    moves.reverse();
  }

  return (
    <>
      <div className="game">
        <div>
          <Board
            squares={currentSquares}
            xIsNext={xIsNext}
            onPlay={handlePlay}
          />
        </div>
        <div className="game-info">
          {isReversed ? <ol reversed>{moves}</ol> : <ol>{moves}</ol>}
        </div>
      </div>
      <button onClick={handleToggle}>Toggle reverse</button>
      <p>Toggled: {isReversed.toString()}</p>
    </>
  );
}

// CONSTANTS AND HELPER FUNCTIONS

// calculates a winner (if any) based on an input array squares
// returns an element in the set { 'X', 'O', 'nobody', null}

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// return an array containing the indices of the three squares that caused the win
function findWinningSquares(squares) {
  for (let i = 0; i < LINES.length; i++) {
    const [a, b, c] = LINES[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return [];
}

function calculateWinner(squares) {
  // check for winning combinations
  for (let i = 0; i < LINES.length; i++) {
    const [a, b, c] = LINES[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  // decide whether the game is a draw or if it should continue
  if (!squares.includes(null)) {
    return "nobody";
  } else {
    return null;
  }
}

export default Game;

import { useState } from 'react';


function Square({ value, onSquareClick }) {
  return (
  <button className="square" onClick={onSquareClick}>
    {value}
  </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;
    const nextSquares = squares.slice();
    xIsNext ? nextSquares[i] = "X" : nextSquares[i] = "O";
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  let x1, x2, y1, y2;
  if (winner) {
     status = `Congrats to ${winner[0]}!`;
     let diff = winner[2] - winner[1];
     x1 = diff === 6 ? 16.7 * (1 + 2 * winner[1]) : 0;
     x2 = diff === 6 ? x1 : 100;
     y1 = (diff === 6 || diff === 8) ? 0 : diff === 4 ? 100 : 16.7 * (1 + 2 * (winner[1] / 3));
     y2 = (diff === 6 || diff === 8) ? 100 : diff === 4 ? 0 : y1;
  } else {
    status = `Now ${xIsNext ? "X" : "O"} turn!`;
  }
  
  return (
    <>
      <div className="status">{status}</div>
      <div className="board">
        {Array.from({length: 3}).map((_, index) => (
          <div className="board-row">
            {Array.from({length: 3}).map((_, indexInRow) => (
              <Square
                value={squares[indexInRow + (3 * index)]}
                onSquareClick={() => handleClick(indexInRow + (3 * index))}
              />
            ))}
          </div>
        ))}
        {
          winner &&  
          <WinLine 
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
          />
        }
      </div>
    </>
  );
}

function WinLine({ x1, y1, x2, y2 }) {
  return (
    <svg className="win-line" viewBox="0 0 100 100">
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
    </svg>
  );
}

export default function Game() {
  const [history, setHistory] = useState([
    Array(9).fill(null),
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      nextSquares,
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let descriptionStart = move === currentMove ?
                          "You're now on " :
                          "Return to "
    let description = move > 0 ?
                      `${descriptionStart}move №${move}` :
                      `${descriptionStart}start`;
    return (
      <li key={move}>
        <button 
          className="move-btn" 
          disabled={move === currentMove}
          onClick={() => jumpTo(move)}>
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay} 
        />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    let [a, b, c] = lines[i];
    if (squares[a] &&
      squares[a] === squares[b] &&
      squares[b] === squares[c]
    ) return [squares[a], a, c];
  }
  return null;
}


/*
TODO:
  При ничьей выводить ничейный результат (всплывающие окна React);
  В истории ходов отображать (row, col) хода
*/
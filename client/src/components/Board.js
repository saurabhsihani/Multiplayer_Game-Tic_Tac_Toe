import React, { useEffect, useState } from "react";
import { useChannelStateContext, useChatContext } from "stream-chat-react";
import Square from "./Square";
import { Patterns } from "../WinningPatterns";

function Board() {
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
  const [player, setPlayer] = useState("O");
  const [turn, setTurn] = useState("O");
  const [result, setResult] = useState({ winner: "none", state: "none" });

  const { channel } = useChannelStateContext();
  const { client } = useChatContext();

  useEffect(() => {
    checkWinner();
    if(result.state === "none") {
      checkIfTie();
    }
  }, [board]);

  const chooseSquare = async (square) => {
    if (turn === player && board[square] === "") {
      setTurn(player === "O" ? "X" : "O");
      await channel.sendEvent({
        type: "game-move",
        data: { square, player },
      });
      setBoard(board.map((val, index) => (index === square ? player : val)));
    }
  };
  const restartGame = async () => {
    await channel.sendEvent({
      type: "restart-game",
    });
    setBoard(["", "", "", "", "", "", "", "", ""]);
    setPlayer("O");
    setTurn("O");
  };
  const checkWinner = () => {
    Patterns.forEach(pattern => {
      const firstPlayer = board[pattern[0]];
      if(firstPlayer === "") {
        return;
      }
      if(board[pattern[1]] === firstPlayer && board[pattern[2]] === firstPlayer) {
        setResult({ winner: firstPlayer, state: "won" })
        alert("Winner is " + result.winner);
        return;
      }
    })
  }
  const checkIfTie = () => {
    let filled = true;
    board.forEach(cell => {
      if(cell === "") {
        filled = false;
      }
    })
    if(filled) {
      setResult({ winner: "none", state: "tie" });
      alert("Tie");
    }
  }

  channel.on((event) => {
    if (event.type === "game-move" && event.user.id !== client.userID) {
      const currentPlayer = event.data.player === "O" ? "X" : "O";
      setPlayer(currentPlayer);
      setTurn(currentPlayer);
      setBoard(
        board.map((val, index) =>
          index === event.data.square ? event.data.player : val
        )
      );
    }
    else if(event.type === "restart-game" && event.user.id !== client.userID) {
      setPlayer("X");
      setTurn("O");
      setBoard(["", "", "", "", "", "", "", "", ""]);
    }
  });

  return (
    <>
      <div className="board">
        <div className="row">
          <Square chooseSquare={() => chooseSquare(0)} value={board[0]} />
          <Square chooseSquare={() => chooseSquare(1)} value={board[1]} />
          <Square chooseSquare={() => chooseSquare(2)} value={board[2]} />
        </div>
        <div className="row">
          <Square chooseSquare={() => chooseSquare(3)} value={board[3]} />
          <Square chooseSquare={() => chooseSquare(4)} value={board[4]} />
          <Square chooseSquare={() => chooseSquare(5)} value={board[5]} />
        </div>
        <div className="row">
          <Square chooseSquare={() => chooseSquare(6)} value={board[6]} />
          <Square chooseSquare={() => chooseSquare(7)} value={board[7]} />
          <Square chooseSquare={() => chooseSquare(8)} value={board[8]} />
        </div>
      </div>
      <button onClick={restartGame}>Restart Game</button>
    </>
  );
}

export default Board;

import React, { useState } from "react";
import { Window, MessageList, MessageInput } from "stream-chat-react";
import Board from "./Board";
import "./Chat.css"

function Game({ channel, setChannel, Input }) {
  const [gameConnected, setGameConnected] = useState(
    channel.state.watcher_count === 2
  );

  channel.on("user.watching.start", (event) => {
    setGameConnected(event.watcher_count === 2);
  });

  const leaveGame = async () => {
    await channel.stopWatching();
    setChannel(null);
  };

  if (!gameConnected) {
    return <h4>Waiting for other user to connect...</h4>;
  }
  return (
    <div class="gameContainer">
      <Board />
      <Window>
        <MessageList
          disableDateSeparator
          closeReactionSelectorOnClick
          hideDeletedMessages
          messageActions={["react"]}
        />
        <MessageInput />
      </Window>
      <button onClick={leaveGame}>Leave Game</button>
    </div>
  );
}

export default Game;

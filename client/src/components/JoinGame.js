import React, { useState } from "react";
import { useChatContext, Channel } from "stream-chat-react";
import Game from "./Game";
import CustomInput from "./CustomInput";

function JoinGame() {
  const [rivalUser, setRivalUser] = useState("");
  const { client } = useChatContext();
  const [channel, setChannel] = useState(null);

  const createChannel = async () => {
    const response = await client.queryUsers({ username: { $eq: rivalUser } });

    if (response.users.length === 0) {
      alert("User not found");
      return;
    }

    const newChannel = await client.channel("messaging", {
      members: [client.userID, response.users[0].id],
    });

    await newChannel.watch();
    setChannel(newChannel);
  };

  return (
    <>
      {channel ? (
        <Channel channel={channel} Input={CustomInput} >
          <Game channel={channel} setChannel={setChannel} />
        </Channel>
      ) : (
        <div className="joinGame">
          <h4>Create Game</h4>
          <input
            placeholder="Rival Username"
            onChange={(e) => setRivalUser(e.target.value)}
          />
          <button onClick={createChannel}>Join/Start Game</button>
        </div>
      )}
    </>
  );
}

export default JoinGame;

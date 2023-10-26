import { useState } from "react";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Cookies from "universal-cookie";
import Login from "./components/Login";
import Signup from "./components/Signup";
import JoinGame from "./components/JoinGame";
import "./App.css";

function App() {
  const api_key = "pvykqc9nyszg";
  const client = StreamChat.getInstance(api_key);
  const cookies = new Cookies();
  const token = cookies.get("token");
  const [isAuth, setIsAuth] = useState(false);

  const handleLogOut = () => {
    cookies.remove("token");
    cookies.remove("username");
    cookies.remove("hashedPass");
    cookies.remove("fname");
    cookies.remove("lname");
    cookies.remove("userId");
    cookies.remove("token");
    cookies.remove("channel");
    client.disconnectUser();
    setIsAuth(false);
  };

  if (token) {
    client
      .connectUser(
        {
          id: cookies.get("userId"),
          username: cookies.get("username"),
          firstName: cookies.get("fname"),
          lastName: cookies.get("lname"),
          hashedPassword: cookies.get("hashedPass"),
        },
        token
      )
      .then((user) => {
        setIsAuth(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <div className="App">
      {isAuth ? (
        <Chat client={client}>
          <JoinGame />
          <button onClick={handleLogOut}>Log Out</button>
        </Chat>
      ) : (
        <>
          <Signup setIsAuth={setIsAuth} />
          <Login setIsAuth={setIsAuth} />
        </>
      )}
    </div>
  );
}

export default App;

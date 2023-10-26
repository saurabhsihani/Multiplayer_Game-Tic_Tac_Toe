import React, { useState } from 'react';
import Axios from 'axios';
import Cookies from 'universal-cookie';

function Login({ setIsAuth }) {
  const cookies = new Cookies();
  const [user, setUser] = useState({username: "", pass: ""});
  
  const handleInputs = event => {
    setUser(oldVal => {
      return {
        ...oldVal,
        [event.target.name]: event.target.value
      }
    })
  }
  const handleLogin = event => {
    Axios.post("http://localhost:3001/login", user)
      .then(res => {
        const { token, userId, fname, lname, username } = res.data;
        cookies.set("token", token);
        cookies.set("userId", userId);
        cookies.set("username", username);
        cookies.set("fname", fname);
        cookies.set("lname", lname);
        setIsAuth(true);
      })
  }
  
  return (
    <div className="login">
      <label>Login</label>
      <input placeholder="Userame" name="username" value={user.username} onChange={handleInputs} />
      <input placeholder="Password" name="pass" value={user.pass} onChange={handleInputs} />
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default Login
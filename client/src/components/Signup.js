import React, { useState } from 'react'
import Axios from 'axios'
import Cookies from 'universal-cookie'

function Signup({ setIsAuth }) {
  const cookies = new Cookies();
  const [user, setUser] = useState({
    fname: "",
    lname: "",
    username: "",
    pass: ""
  });

  const handleInputs = event => {
    setUser(oldVal => {
      return {
        ...oldVal,
        [event.target.name]: event.target.value
      }
    })
  }
  const handleSignUp = event => {
    Axios.post("http://localhost:3001/signup", user)
      .then(res => {
        const { token, userId, username, hashedPass, fname, lname } = res.data;
        cookies.set("token", token);
        cookies.set("userId", userId);
        cookies.set("username", username);
        cookies.set("hashedPass",hashedPass);
        cookies.set("fname", fname);
        cookies.set("lname", lname);
        setIsAuth(true);
      })
  }

  return (
    <div className="signUp">
      <label>SignUp</label>
      <input placeholder="First Name" name="fname" value={user.fname} onChange={handleInputs} />
      <input placeholder="Last Name" name="lname" value={user.lname} onChange={handleInputs} />
      <input placeholder="Userame" name="username" value={user.username} onChange={handleInputs} />
      <input placeholder="Password" name="pass" value={user.pass} onChange={handleInputs} />
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  )
}

export default Signup
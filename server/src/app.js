const express = require('express');
const cors = require('cors');
const { StreamChat } = require('stream-chat');
const { v4: uuidv4 }  = require('uuid');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const api_key = "pvykqc9nyszg";
const api_secret = "5nukjmbw2es8cfnqqgajxc4bt5ctzqm737rfb6ar5zbrr5qtyy2y9kfdjta54vhr";
const serverClient = StreamChat.getInstance(api_key, api_secret);

app.post("/signup", (req, res) => {
  const {fname, lname, username, pass} = req.body;
  const userId = uuidv4();
  bcrypt.hash(pass, 10)
    .then(hashedPass => {
      const token = serverClient.createToken(userId);
      res.json({ token, userId, username, hashedPass, fname, lname });
    })
    .catch(err => {
      res.json(err);
    })
})

app.post("/login", (req, res) => {
  const { username, pass } = req.body;
  serverClient.queryUsers({ username: username })
    .then(response => {
      if(response.users.length === 0) {
        res.json({ message: "User not found" });
      }
      
      const { id, firstName, lastName, hashedPassword } = response.users[0];
      bcrypt.compare(pass, hashedPassword)
        .then(result => {
          if(result) {
            const token = serverClient.createToken(id);
            res.json({ token, userId: id, fname: firstName, lname: lastName, username, hashedPass: hashedPassword });
          }
        })
    })
    .catch(err => {
      res.json(err);
    })
})

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
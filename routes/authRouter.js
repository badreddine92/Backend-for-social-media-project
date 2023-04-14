const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {userToJson} = require('../helpers/toJson')

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, is_chef } = req.body;

    if (!(email && password && username && is_chef !== undefined && is_chef !== null)) {
      return res.status(400).json({
        message : "All fields must be filled",
      })
    }

    const oldUser = await User.findOne({ email }) 
    const usernameExists = await User.findOne({username})

    if (oldUser) {
      return res.status(409).json({
        message : "Email already used, please login",
      })
    }
    if(usernameExists) 
    {
      return res.status(409).json({
        message : "Username already used",
      })
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: encryptedPassword,
      is_chef,
    });

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    user.token = token;

    res.status(201).json(userToJson(user.token, user.id, user.username, user.email, user.is_chef));
  } catch (err) {
    console.error(err);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const {  email, password } = req.body;

    if (!(email && password)) {
      res.status(400).json({
        message : "All input is required",
      });
    }

    const user = await User.findOne({ email }) 

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      user.token = token;
      res.status(201).json(userToJson(user.token, user.id, user.username, user.email, user.is_chef));
    } else {
      res.status(400).json({
        message : "Username or password incorrect",
      })
    }
  } catch (err) {
    console.error(err);
  }
});

router.get('/routes' , async (req,res) =>
{
  res.json({
    'login' : '/login',
    'register' : '/register'
  })
})
module.exports = router;
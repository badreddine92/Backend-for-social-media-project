const express = require("express");
const router = express.Router()
const {verifyToken} = require('../middleware/auth')
const User = require('../models/user')
const Recipe = require('../models/recipe')
const _ = require('underscore')




router.post('/:keyword', verifyToken, async (req, res) => {
    const keyword = req.params.keyword;
  
     
       try {
          const users = await User.find({ username: keyword });
          if (_.isEmpty(users)) {
            return res.status(400).send("No users found");
          } else {
            return res.status(200).json(users);
          }
  
       
    } catch (err) {
      console.error(err);
      return res.status(500).send("Something went wrong");
    }
  });
  

module.exports = router;
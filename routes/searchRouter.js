const express = require("express");
const router = express.Router()
const {verifyToken} = require('../middleware/auth')
const User = require('../models/user')
const Recipe = require('../models/recipe')
const _ = require('underscore')




router.post('/:keywords/:where', verifyToken, async (req, res) => {
    const keywords = req.params.keywords;
    const location = req.params.where;
  
   
    const validLocations = ["users", "recipes"];
  
    try {
      if (!validLocations.includes(location)) {
        return res.status(400).send("Invalid location");
      }
  
      switch (location) {
        case "users":
          const users = await User.find({ username: keywords });
          if (_.isEmpty(users)) {
            return res.status(400).send("No users found");
          } else {
            return res.status(200).json(users);
          }
  
        case "recipes":
          const recipes = await Recipe.find({ title: keywords });
          if (_.isEmpty(recipes)) {
            return res.status(400).send("No recipes found");
          } else {
            return res.status(200).json(recipes);
          }
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send("Something went wrong");
    }
  });
  

module.exports = router;
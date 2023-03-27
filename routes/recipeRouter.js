const express = require("express");
const Recipe = require('../models/recipe');
const User = require('../models/user')
const {verifyToken} = require('../middleware/auth')

const router = express.Router();

router.post('/add-recipe', verifyToken , async (req,res) => {
   try {
        const user_id = req.user.user_id;
        const { title , ingredients , instructions , recipePicture } = req.body
        if (!(title && ingredients && instructions && recipePicture)) {
            return res.status(400).send("All fields must be filled");
        }
        
        const recipe = await Recipe.create({
            user_id,
            title,
            ingredients,
            instructions,
            recipePicture
        });

        const user = await User.findOne({ _id: user_id });

        user.recipes.push(recipe._id);

        await user.save();

      
        res.status(201).json(recipe.toJSON());
   } catch(err) {
       console.log(err);
       res.status(500).send("Something went wrong");
   }
});

module.exports = router;

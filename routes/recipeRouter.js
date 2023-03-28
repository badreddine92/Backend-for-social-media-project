const express = require("express");
const Recipe = require('../models/recipe');
const User = require('../models/user')
const {verifyToken} = require('../middleware/auth')
const mongoose = require('mongoose')

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

router.post('/:recipeId/add-favorite', verifyToken , async (req,res) =>
{
    const recipeId = req.params.recipeId
    const user = await User.findById(req.user.user_id)

    try {
        user.favorites.push(recipeId)
        await user.save()
        return res.status(200).send('Added to favorites')
    }catch(err)
    {
        console.log(err)
        return res.status(500).send('Something went wrong')
    }
})

router.post('/:recipeId/like' , verifyToken , async (req,res) => {
    const recipe = await Recipe.findById(req.params.recipeId)
    const userId = req.user.user_id
    try{
        recipe.likes.push(userId)
        await recipe.save()
        return res.status(200).send('You liked this post')
    }catch(err)
    {
        console.log(err)
        return res.status(500).send('Something went wrong')
    }
})

router.get('/:recipeId' , async(req,res) => {
   try {
    const recipe = await Recipe.findById(req.params.recipeId).select('-__v')
    return res.status(201).json(recipe.toJSON())
}catch(err)
{
    console.log(err)
    return res.status(404).send('Recipe not found')
}
})

router.get('/:recipeId/liked-by' , async(req,res) => {
    try {
     const recipe = await Recipe.findById(req.params.recipeId).select('likes -_id')
     return res.status(201).json(recipe)
 }catch(err)
 {
     console.log(err)
     return res.status(500).send('Something went wrong')
 }
 })

 router.post('/:recipeId/comment', verifyToken , async (req, res) =>{
    console.log(req.body.comment)
    try{
      const recipe = await Recipe.findById(req.params.recipeId)
      const comment = {comment: req.body.comment , user: req.user.user_id}
      recipe.comments.push(comment);
      await recipe.save();
      return res.status(200).json({massage: 'Comment added succes' , comment})
 
     }catch(err)
     {
         console.log(err)
         return res.status(500).send('Something went wrong')
     }
  })
 

module.exports = router;

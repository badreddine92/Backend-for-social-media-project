const express = require("express");
const Recipe = require('../models/recipe');
const User = require('../models/user')

const {verifyToken} = require('../middleware/auth')
const mongoose = require('mongoose')
const {recipeToJson} = require('../helpers/toJson')
const {createNotifications} = require('../helpers/createnotifications')
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/recipePictures');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
}).single('recipePicture');



router.post('/add-recipe' ,verifyToken ,upload, async (req, res) => {
  try {
    const { title , ingredients, instructions, preparation_time, nbr_personnes, categorie, description } = req.body;
    const userr = await User.findById(req.user.user_id).select('-_id username');
    const username = userr.username;
    if (!(title && ingredients && instructions && req.file !== undefined)) {
      if(!req.file)
      {
        return res.status(400).json({
          message: "There is no image"
        });
      }
      return res.status(400).json({
        message: "All fields are required"
      });
    }
    const recipe = await Recipe.create({
      username: username,
      title : req.body['title'],
      description,
      preparation_time,
      nbr_personnes,
      ingredients,
      instructions,
      categorie,
      recipePicture: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    });
    const user = await User.findOne({ _id: req.user.user_id });
    user.recipes.push(recipe._id);
    await user.save();
    res.status(201).json(recipe.toJSON());
  } catch (err) {
    console.error(err);
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
        return res.status(200).json({
            message : "Added to favorites",
          })
    }catch(err)
    {
        console.error(err)
        return res.status(500).send('Something went wrong')
    }
})

router.post('/:recipeId/like' , verifyToken , async (req,res) => {
    const recipe = await Recipe.findById(req.params.recipeId)
    if(!recipe) throw new Error('NNNNNNNNNNNNNNNNN');
    const userId = req.user.user_id
    const user = await User.findById(userId)
    try{
        createNotifications(recipe.username,'like' , recipe._id, userId, null)
        recipe.likes.push(user.username)
        await recipe.save()
        return res.status(200).json({
            message : "You liked this post",
          })
    }catch(err)
    {
        console.error(err)
        return res.status(500).send('Something went wrong')
    }
})

router.get('/:recipeId' , async (req,res) => {
   try {
    const recipe_id = req.params.recipeId
    console.log(recipe_id)
    const recipe = await Recipe.findById(recipe_id).select('-__v')
    return res.status(201).json(recipeToJson(recipe))
    }
    catch(err)
    {
        console.error(err)
        return res.status(404).json({
            message : "Recipe not found",
        })
    }
})

router.get('/:recipeId/liked-by' , async(req,res) => {
    try {
     const recipe = await Recipe.findById(req.params.recipeId).select('likes -_id')
     return res.status(201).json(recipe)
 }catch(err)
 {
     console.error(err)
     return res.status(500).send('Something went wrong')
 }
 })

 router.post('/:recipeId/comment', verifyToken , async (req, res) =>{
    console.log(req.body.comment)
    try{
      const recipe = await Recipe.findById(req.params.recipeId)
      const user = await User.findById(req.user.user_id)
      const comment = {comment: req.body.comment , user: user.username }
      const userId = req.user.user_id

      createNotifications(recipe.user_id,'comment' , recipe._id, userId,comment._id)
      recipe.comments.push(comment);
      await recipe.save();
      return res.status(200).json({massage: 'Comment added' , comment})
 
     }catch(err)
     {
         console.error(err)
         return res.status(500).send('Something went wrong')
     }
  })

  router.put('/:id/edit', verifyToken, async (req, res, next) => {
    const { title, description, preparation_time , nbr_personne, ingredients, instructions } = req.body;
    try {
        const recipe = await Recipe.findByIdAndUpdate(req.params.id, {
            $set: {
                title: title,
                description: description,
                preparation_time: preparation_time,
                cook_time: cook_time,
                nbr_personne: nbr_personne,
                ingredients: ingredients,
                instructions: instructions
            }
        }, { new: true })
        res.status(200).json({ message: 'recipe has been updated succesfully', recipe });


    }
    catch (err) {
        (err) => {
            res.status(500).json({ message : "Something went wrong" })
        }
    }
});
 
 

module.exports = router;

const express = require('express')
const User = require('../models/user')
const Recipe = require('../models/recipe')
const router = express.Router()
const {verifyToken} = require('../middleware/auth')
const {recipeToJson} = require('../helpers/toJson')
const {createnotifications} = require('../helpers/createnotifications')
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/profilePictures');
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
  }).single('profilePicture');

router.get('/:username' , async (req,res) =>
{
    try {
        const username = req.params.username
        const user = await User.findOne({username}).select('-password -__v')

        if(!user)
        {
            return res.status(404).json({
                message : "User not found",
            })
        }
        return res.status(201).json(user.toJSON())

    } catch(err)
    {
        console.log(err);
        res.status(500).send("Something went wrong");
    }


})

router.post('/:username/follow',verifyToken, async  (req,res) => {
    const userId = req.user.user_id
    const username = req.params.username
    const followedUser = await User.findOne({username})
    const followingUser = await User.findOne({_id : userId})
    try{
        createnotifications(followedUser.id, 'follow', null , followingUser.id , null  )
        followingUser.following.push(followedUser.username)
        followedUser.followers.push(followingUser.username)
        await followedUser.save()
        await followingUser.save()
        return res.status(200).json({
            message : `You are now following ${followedUser.username}`,
          })
    } catch(err)
    {
        console.error(err)
        res.status(500).send('Something went wrong')
    }
})

router.get('/:username/followers',async (req,res ) => {
    const username = req.params.username
    try{
        const user = await User.findOne({username})
        return res.status(200).json( {
            "followers" : user.followers
        });
    } catch(err)
    {
        console.error(err)
        return res.status(500).send('something went wrong')
    }
})

router.get('/:username/following'  ,async (req,res ) => {
    const username = req.params.username
    try{
        const user = await User.findOne({username})
        return res.status(200).json(
            {
                "following" : user.following
            });
    } catch(err)
    {
        console.error(err)
        return res.status(500).send('something went wrong')
    }
})

router.post('/favorites' ,verifyToken , async (req,res) =>{
    const userId = req.user.user_id
    try{
        const user = await User.findOne({_id : userId})
        return res.status(200).json(
            {
                "favorites" : user.favorites
            }) 
    }catch(err)
    {
        console.error(err)
        return res.status(500).send("Something went wrong")
    }
})

router.post('/feed' , verifyToken , async (req ,res) => {
    try 
    {
        const user = await User.findById(req.user.user_id)
        console.log(user)
        const following = user.following;
        console.log(following)

        const recipes = await Recipe.find({ user_id: { $in: following } })
        .sort({ createdAt: -1 }).select('-__v')

        console.log(recipes)

        return res.status(200).json(recipes)


    }catch(err)
    {
        console.error(err)
        return res.status(500).send("Something went wrong")
    }
})

router.post('/notifications' , verifyToken , async (req,res) => {
    try
    {
        const user = await user.findById(req.user.user_id)
        const notifications = user.notifications.sort({createdAt : -1});
        if(notifications){
            return res.status(200).json(
                {
                    "notifications" : [
                        notifications
                    ]
                }
            )
        } else 
        {
            return res.status(201).json(
                {
                    "message" : "No notifications"
                }
            )
        }
    } catch(err)
    {
        console.error(err)
        return res.status(500).send("Something went wrong")
    }
}
)

router.get('/user/:userId' , async (req,res) => {
    try {
        const userId = req.params.userId
        const user = await User.findById(userId).select('-password -__v')

        if(!user) {
            return res.status(404).json({
                message : "User not found ++",
            })
        }
        return res.status(201).json(user.toJSON())

    } catch(err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
})

router.post('/delete-user', verifyToken, async (req,res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.user_id)
        const deletedRecipes = await Recipe.deleteMany({ user_id: req.user.user_id })
        return res.status(200).json({"message" : "User successfully deleted" })
    } catch(err) {
        console.error(err)
        return res.status(500).send("Something went wrong")
    }
})

router.post('/add-profilepic' ,verifyToken ,upload , async (req,res) =>{
    const userId = req.user.user_id 
    try{
        const user = await User.findById(userId) 
        if(!req.file){
            return res.status(500).json(
                {
                    message : "A picture is required"
                }
            )
        } 
        user.recipePicture = {
            data: req.file.buffer,
            contentType: req.file.mimetype
          };
         await user.save()
         return res.status(200).json(
            {
                message :"Your profile picture is updated"
            }
         )

    }catch(err)
    {
        console.error(err)
        return res.status(500).send("Something went wrong")
    }
})

router.post('/delete-user', verifyToken, async (req,res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.user_id)
        const deletedRecipes = await Recipe.deleteMany({ user_id: req.user.user_id })
        return res.status(200).json({"message" : "User successfully deleted" })
    } catch(err) {
        console.error(err)
        return res.status(500).send("Something went wrong")
    }
})

router.put('/edit', verifyToken , async(req, res, next) => {
    const { name, email, password, is_chef } = req.body;

    try {

        const user = await User.findByIdAndUpdate(req.user.user_id , {
            $set: {
                name: name,
                email: email,
                password: await bcrypt.hash(password, 10),
                is_chef: is_chef,
            }
        }, { new: true }).select("-password")
        res.status(200).json({ message: 'user has been updated succesfully', user: user });


    }
    catch (err) {
        (err) => {
            res.status(500).json({ message : "Something went wrong" })
        }
    }
})

module.exports = router
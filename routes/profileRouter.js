const express = require('express')
const User = require('../models/user')
const Recipe = require('../models/recipe')
const router = express.Router()
const {verifyToken} = require('../middleware/auth')
const {recipeToJson} = require('../helpers/toJson')
const {createnotifications} = require('../helpers/createnotifications')

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
        // createnotifications(followedUser.id, 'follow', null , followingUser.id , null  )
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



module.exports = router
const express = require('express')
const User = require('../models/user')
const Recipe = require('../models/recipe')
const router = express.Router()
const {verifyToken} = require('../middleware/auth')

router.get('/:username' , async (req,res) =>
{
    try {
        const username = req.params.username
        const user = await User.findOne({username}).select('-password -__v')

        if(!user)
        {
            return res.status(404).send('User not found')
        }
        console.log(user.toJSON())
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
        followingUser.following.push(followedUser._id)
        followedUser.followers.push(followingUser._id)
        await followedUser.save()
        await followingUser.save()
        return res.status(200).send(`You are now following ${followedUser.username}`)
    } catch(err)
    {
        console.log(err)
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
        console.log(err)
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
        console.log(err)
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
        console.log(err)
        return res.status(500).send("Something went wrong")
    }
})

router.post('/feed' , verifyToken , async (req ,res) => {
    try 
    {
        const user = await User.findById(req.user.user_id)
        const following = user.following;

        const recipes = await Recipe.find({ user_id: { $in: following } })
        .sort({ createdAt: -1 }).select('-__v')

        return res.status(200).json(recipes)


    }catch(err)
    {
        console.log(err)
        return res.status(500).send("Something went wrong")
    }
})
module.exports = router
const express = require('express')
const { findOne } = require('../models/user')
const User = require('../models/user')
const router = express.Router()

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

module.exports = router
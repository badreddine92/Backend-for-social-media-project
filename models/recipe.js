const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
    user_id: { 
        type: mongoose.Schema.Types.ObjectId,
        ref : 'user',
    },
    title: { 
        type: String
    },
    ingredients:[{type : String}],
    instructions:{
        type : String
    },
    recipePicture : {
        type: String,
        default: '',
      },
    likes : [
        {type : mongoose.Schema.Types.ObjectId,
        ref : 'user'}],
     comments: [
        {
                comment: {
                    type: String,
                    required: true
                },
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'user',
                    required: true
                },
                time: {
                    type: Date,
                    default: Date.now
                }
                }
            ],
    time : {
        type: Date,
        default : Date.now
    }
  },
  {collection: 'recipes'});
  
  module.exports = mongoose.model("recipe", recipeSchema);
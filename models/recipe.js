const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
    username: { 
       type : String,
       required : true
    },
    title: { 
        type: String,
        required : true
    },
    descrption: {
        type: String
    },
    preparation_time: {
        type: String
    },

    nbr_personne :{
        type : Number
    },
    ingredients: [
        {
          title: { type: String, required: true },
          weight: { type: Number, required: true },
          unit: { type: String }
        }],
    instructions:[{
        type : String
    }],

    categorie:{
        type : String
    },
    recipePicture: {
        data: Buffer,
        contentType: String
      },
    
    likes : [
        {
            type : String
        }],
     comments: [
        {
                comment: {
                    type: String,
                    required: true
                },
                user: {
                   type : String,
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
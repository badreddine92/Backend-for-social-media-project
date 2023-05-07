const recipe = require('../models/recipe');

exports.userToJson = (token, id, username, email, is_chef) => {
    return {
      token,
      user: {
        id,
        username,
        email,
        is_chef,
      },
    };
  }
const Recipe = require('../models/recipe')
exports.recipeToJson = (Recipe) => {
  return {
    user : Recipe.user_id , 
    recipe : {
      id : Recipe.id,
      ingredients : Recipe.ingredients,
      instructions : Recipe.instructions,
      time : Recipe.time,
      picture : Recipe.recipePicture,
      likes : Recipe.likes,
      comments : Recipe.comments,
    }
  }
}
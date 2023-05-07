const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String,unique: true },
  email: { type: String, unique: true },
  password: { type: String },
  token: { type: String },
  is_chef: { type: Boolean },
  recipes: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref : 'recipe',
}],
  followers: [{
    type : String
  }],
  following: [{
    type : String
  }],
  favorites: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref : 'recipe',
}],
notifications: {
  type: [{
    body: String,
    type: String,
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'recipe' },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    date: { type: Date, default: Date.now }
  }],
  default: []
}
});

module.exports = mongoose.model("user", userSchema);
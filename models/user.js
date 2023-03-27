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
});

module.exports = mongoose.model("user", userSchema);
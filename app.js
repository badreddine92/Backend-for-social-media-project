require("dotenv").config();
const express = require("express");
const cors = require('cors')
const {connect} = require("./config/database");
const authRouter = require("./routes/authRouter");
const recipeRouter = require('./routes/recipeRouter')
const profileRouter = require('./routes/profileRouter')
const searchRouter = require('./routes/searchRouter')

const app = express();

app.use(express.json());
app.use(cors());
app.use("/", authRouter);
app.use("/search", searchRouter);
app.use('/recipes' , recipeRouter)
app.use('/profile' , profileRouter)

connect();

module.exports = app;

require("dotenv").config();
const express = require("express");
const {connect} = require("./config/database");
const authRouter = require("./routes/authRouter");
const recipeRouter = require('./routes/recipeRouter')
const profileRouter = require('./routes/profileRouter')

const app = express();

app.use(express.json());

app.use("/", authRouter);
app.use('/' , recipeRouter)
app.use('/' , profileRouter)

connect();

module.exports = app;

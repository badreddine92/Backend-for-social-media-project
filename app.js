require("dotenv").config();
const express = require("express");
const {connect} = require("./config/database");
const authRouter = require("./routes/authRouter");

const app = express();

app.use(express.json());

app.use("/", authRouter);

connect();

module.exports = app;

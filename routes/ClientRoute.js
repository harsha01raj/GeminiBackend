const express = require("express");
const ClientModel = require("../model/UserModel");
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken")
const dotenv=require("dotenv").config();
const ClientRouter = express.Router();

ClientRouter.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existinguser = await ClientModel.findOne({ email });
    console.log(existinguser);
    if (existinguser) {
      return res
        .status(400)
        .json({ Message: "User already exists in our database" });
    }
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        return res.status(500).json({ Message: err.message });
      }
      try {
        const user = new ClientModel({
          username,
          email,
          password: hash,
        });
        await user.save();
        res
          .status(201)
          .json({ Message: "You are registered successfully", User: user });
      } catch (error) {
        res.status(400).json({ Message: error.message });
      }
    });
  } catch (error) {
    res.status(500).json({ Message: error.message });
  }
});

ClientRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await ClientModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ Message: "User not found. Please register first" });
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json({ Message: "An error occurred" });
      }
      if (!result) {
        return res.status(400).json({ Message: "Invalid password" });
      }
      const token=jwt.sign({user:user},process.env.JWT_SECRET);
      res
        .status(200)
        .json({ Message: "You have successfully logged in", login: true,User:user, Token:token});
    });
  } catch (error) {
    res.status(500).json({ Message: error.message });
  }
});

module.exports = ClientRouter;

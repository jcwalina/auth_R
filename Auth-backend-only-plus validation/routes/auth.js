const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");

// REGISTER
router.post("/register", async (req, res) => {
  // Validate the user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checking if user exists in DB
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send("email already exists");

  //HASH password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Create new user
  const { name, email } = req.body;
  const user = new User({
    name,
    email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  // Validate the user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checking if user exists in DB
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("email not found ");

  //Password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid Password");

  // Create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token);
  // jesli chcesz zeby twoj token expire np po 1 h, tak zeby automatycznie wylogowalo usera to powyższą linie mozesz zastpić tym : const token = jwt.sign({ _id: user._id }, "Stack", {expiresIn: "1h"}, process.env.TOKEN_SECRET);

  // To see the token, uncomment this line and comment out the line after and the one before
  res.header("auth-token", token).send(token);
  //   res.send("Logged in");
});

module.exports = router;

const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// register
router.post("/register", async (req, res) => {
  try {
    // generate hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    //check if user exist
    if (!user) {
      return res.status(404).json("User not found");
    }
    //compare password and respond
    const loginSuccess = await bcrypt.compare(req.body.password, user.password);
    if (loginSuccess) {
      return res.status(200).json(user);
    } else {
      return res.status(400).json("Wrong Credentials");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

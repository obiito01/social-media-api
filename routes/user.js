const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
router.get("/", (req, res) => {
  res.json("this is user route");
});

//get a user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json("User not found");
    }
    const { password, updatedAt, ...others } = user._doc;

    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete user
router.delete("/:id", async (req, res) => {
  try {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json("User not found");
      }

      return res.status(200).json("Account deleted");
    } else {
      return res.status(403).json("Actions not allowed");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// //update user
router.put("/:id", async (req, res) => {
  try {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      //encrypt password if provided
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }
      //update user
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      if (!user) {
        return res.status(404).json("User not found");
      }
      res.status(200).json(user);
    } else {
      return res.status(403).json("Actions not allowed");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//follow user
router.put("/:id/follow", async (req, res) => {
  try {
    if (req.body.userId !== req.params.id) {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user) {
        return res.status(404).json("User not found");
      }

      if (!user.followers.includes(currentUser._id)) {
        await User.findByIdAndUpdate(
          user.id,
          { $push: { followers: req.body.userId } },
          { new: true }
        );
        const updatedUser = await User.findByIdAndUpdate(
          currentUser.id,
          { $push: { followings: req.params.id } },
          { new: true }
        );

        return res.status(200).json(updatedUser);
      } else {
        await User.findByIdAndUpdate(
          user.id,
          { $pull: { followers: req.body.userId } },
          { new: true }
        );
        const updatedUser = await User.findByIdAndUpdate(
          currentUser.id,
          { $pull: { followings: req.params.id } },
          { new: true }
        );

        return res.status(200).json(updatedUser);
      }
    } else {
      res.status(403).json("You can't follow yourself");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//unfollow user
router.put("/:id/unfollow", async (req, res) => {
  try {
    if (req.body.userId !== req.params.id) {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user) {
        return res.status(404).json("User not found");
      }
      if (user.followers.includes(currentUser._id)) {
        return res.status(200).json("Unfollowed");
      } else {
        return res.status(403).json("You are not following this user");
      }
    } else {
      res.status(403).json("You can't unfollow yourself");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
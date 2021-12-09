const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// create new post
router.post("/", async (req, res) => {
  try {
    const newPost = await new Post(req.body);
    const savedPost = await newPost.save();

    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json("Post not found");
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      if (post.userId !== req.body.userId || req.body.isAdmin) {
        return res.status(403).json("Actions not allowed");
      }
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      return res.status(200).json(updatedPost);
    } else {
      return res.status(404).json("Post not found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      if (post.userId !== req.body.userId || req.body.isAdmin) {
        return res.status(403).json("Actions not allowed");
      }
      await Post.findByIdAndDelete(req.params.id);
      return res.status(200).json("Post deleted");
    } else {
      return res.status(404).json("Post not found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get timeline post
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );

    const resultArr = userPosts.concat(...friendPosts);

    res.status(200).json(resultArr);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get user's all posts
router.get("/profile/:userId", async (req, res) => {
  try {
    const userPosts = await Post.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(userPosts);
  } catch (err) {
    res.status(500).json(err);
  }
});

//like/dislike  a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.body.userId);
    if (!post) {
      return res.status(404).json("Post not found");
    }
    if (!user) {
      return res.status(404).json("User not found");
    }

    if (!post.likes.includes(req.body.userId)) {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        {
          $push: { likes: req.body.userId },
        },
        { new: true }
      );

      res.status(200).json(updatedPost);
    } else {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        {
          $pull: { likes: req.body.userId },
        },
        { new: true }
      );
      res.status(200).json(updatedPost);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

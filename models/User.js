const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 3,
      maxLength: 20,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxLength: 50,
      trim: true,
    },
    password: { type: String, required: true, trim: true },
    profilePicture: { type: String, default: "" },
    coverPicture: { type: String, default: "" },
    followers: { type: Array, default: [] },
    followings: { type: Array, default: [] },
    isAdmin: { type: Boolean, default: false },
    desc: {
      type: String,
      maxLength: 50,
    },
    city: {
      type: String,
      trim: true,
    },
    relationship: {
      type: String,
      enum: ["Single", "Married", "Complicated"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const { json } = require("express");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

// connect mongoDB
const connectDB = async (uri) => {
  await mongoose.connect(uri);
  console.log("Connected to MongoDB.");
};
// start server iife
(async () => {
  await connectDB(process.env.MONGO_URL);
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is listening ${process.env.PORT || 5000}...`);
  });
})();

// Import Modules
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("./config/mongoose");
const cors = require("cors");
const passport = require("passport");
require("./config/passport")(passport);

// Router
const userRouter = require("./routes/").user;
const postRouter = require("./routes/").post;
const readRouter = require("./routes").read;
const editRouter = require("./routes").edit;
// Connect to MongoDB Atlas
const db = mongoose();
// Middle wares
// Post require
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

// Routing
app.use("/api/user", userRouter);
app.use("/api/read", readRouter);
// Post Routing, Protected from JWT
// without JWT, the request will be unauthorized
app.use("/api/post", passport.authenticate("jwt", { session: false}), postRouter);
app.use("/api/edit", passport.authenticate("jwt", { session: false}), editRouter);


// PORT
PORT = process.env.HOST || 8080;

// Listen
app.listen(PORT, () =>
{
    console.log(`The server is running on port ${PORT}`);    
})
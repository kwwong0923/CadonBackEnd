const router = require("express").Router();
const postController = require("../controllers").postController;

// GET
// Get all the Posts
router.get("/", postController.getPosts);

// Search Function
// Get by user name
router.get("/name/:_username", postController.getPostsByUsername);


// Get by post _id
router.get("/post/:_id", postController.getPostsByPostId);

// Get by category
router.get("/category/:category", postController.getPostsByCategory);

// Get by keyword
router.get("/keyword/:keyword", postController.getPostsByKeyword);

// Get hottest posts
router.get("/hot", postController.getHotPosts);
module.exports = router;

const router = require("express").Router();
const postController = require("../controllers").postController;

// GET
// Get all the Posts
router.get("/", postController.getPosts);

// Search Function
// Get by user name
router.get("/name/:_username", postController.getPostsByUsername);

// Get by user id (not _id)
router.get("/user/:id", postController.getPostsByUserId);

// Get by post _id
router.get("/post/:_id", postController.getPostsByPostId);

// Get by category
router.get("/category/:category", postController.getPostsByCategory);

// Get by keyword
router.get("/keyword/:keyword", postController.getPostsByKeyword);

module.exports = router;

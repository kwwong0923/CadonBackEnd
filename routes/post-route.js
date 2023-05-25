const router = require("express").Router();
// Controller
const postController = require("../controllers").postController;

router.use((req, res, next) =>
{
    console.log("----------Enter Post Route----------");
    // console.log(req.user);
    next();
});

router.post("/testapi", async (req, res) =>
{
    console.log(req.user);
    return res.send("You got there");
})

// ----------POST------------
// Create New Post
router.post("/", postController.createNewPost);
// Like the Post
router.post("/like/:_id", postController.likeThePost);
// Dislike the Post
router.post("/dislike/:_id", postController.dislikeThePost)
// Like the Post's replies
router.post("/like/:_id/:replyIndex", postController.likeTheReply);
// Dislike the Post's replies
router.post("/dislike/:_id/:replyIndex", postController.dislikeTheReply);
// Save a post
router.post("/save/:_id", postController.savePost);
// Un save aa post
router.post("/unsaved/:_id", postController.unsavedPost);
// ----------REPLY------------
router.post("/reply/:_postId", postController.replyPost);

// -----------GET----------
// Get posts from saved posts
router.get("/saved", postController.getPostsFromSaved);
// Get by user id 
router.get("/user/:id", postController.getPostsByUserId);


module.exports = router;

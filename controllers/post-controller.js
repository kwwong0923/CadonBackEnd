const Post = require("../models").post;
const User = require("../models").user;
const Reply = require("../models").reply;

const postValidation = require("../validation").postValidation;

// ----------POST------------
// POST - Create new post
module.exports.createNewPost = async function(req, res)
{
    let { error } = postValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message); 

    let _id = req.user._id;
    let { title, content, category } = req.body;
    let newPost = new Post(
        {
            title, content, category,
            creator: _id,
            date: new Date()
        }
    )
    try 
    {
        console.log("HERE");
        let savedPost = await newPost.save();
        let foundUser = await User.findOne({ _id }).exec();
        foundUser.ownedPost.push(savedPost._id);
        await foundUser.save();
        return res.send({
            message: "The new post is published successfully",
            savedPost
        })
    } 
    catch (err) 
    {
        return res.status(500).send(err);
    }
};

// POST - Save Post
module.exports.savePost = async function (req, res)
{
    console.log("save");
    let _id = req.params;
    let userId = req.user._id;
    try
    {
        console.log("HERE");
        let foundUser = await User.findOne({ _id: userId}).exec();
        let foundPost = await Post.findOne({ _id}).exec();
        // console.log(foundPost);
        foundUser.savedPost.push(_id);
        console.log(foundUser.savedPost);
        await foundUser.save();
        return res.send("The post saved to your favorite list")
    }
    catch (err)
    {
        return res.status(500).send(err);
    }
}

// GET - Get all the posts
module.exports.getPosts = async function(req, res)
{
    try
    {
        console.log("GET - Get all the posts");
        let postsFound = await Post.find({})
                                    .populate("creator", ["username"])
                                    .populate("reply.userId", ["username"])
                                    .sort( {lastUpdated: -1})
                                    .exec();
        return res.send(postsFound);        
    }
    catch (err)
    {
        return res.status(500).send(err);
    }
}

// Get - Get posts by User Name
module.exports.getPostsByUsername = async function(req, res)
{
    let { _username } = req.params;
    try
    {
        let userFound = await User.findOne({username: _username}).exec();
        if(!userFound) return res.status(400).send("The username doesn't exist");
        let postsFound = await Post.find({creator : userFound._id}).populate("creator", ["username", "_id"]);
        if (!postsFound) return res.status(500).send("The username doesn't have any posts");
        return res.send(postsFound);
    }
    catch (err)
    {
        return res.status(500).send(err);
    }
}

// Get - Get posts by User id (not _id)
module.exports.getPostsByUserId = async function(req, res)
{
    let { id } = req.params;
    try
    {
        let userFound = await User.findOne({id}).exec();
        if (!userFound) return res.status(400).send("The username id doesn't exist");

        let postsFound = await Post.find({creator : userFound._id}).populate("creator", ["username", "_id"]);
        return res.send(postsFound);
    }
    catch (err)
    {
        return res.status(500).send(err);
    }
}

// Get - Get post by _id
module.exports.getPostsByPostId = async function(req, res)
{
    let { _id } = req.params;
    try
    {
        let postFound = await Post.findOne({ _id }).exec();
        return res.send(postFound);
    }
    catch (err)
    {
        return res.status(500).send(err);
    }
}

// Get - Get post by category
module.exports.getPostsByCategory = async function(req, res)
{
    let { category } = req.params;
    try
    {
        let postFound = await Post.find({category})
                                    .populate("creator", ["username"])
                                    .populate("reply.userId", ["username"])
                                    .sort({lastUpdated: -1})
                                    .exec();
        return res.send(postFound);
    }
    catch (err)
    {
        return res.status(500).send(err);
    }
}

// Get -Get post by keyword
module.exports.getPostsByKeyword = async function(req, res)
{
    let { keyword } = req.params;
    try
    {
        let regex = new RegExp(keyword, "i");
        let postFound = await Post.find({ title: regex})
                                    .populate("creator", ["username"])
                                    .populate("reply.userId", ["username"])
                                    .sort({lastUpdated: -1})
                                    .exec();
        return res.send(postFound);
    }
    catch (err)
    {
        return res.status(500).send(err)
    }
}

// POST - Like the post
module.exports.likeThePost = async function(req, res)
{
    let { _id } = req.params;
    let userId = req.user._id;

    try
    {
        let postFound = await Post.findOne({ _id }).exec();
        if (!postFound.likeOrDislikeBefore(userId, true))
        {
            console.log("If");
            if (postFound.likeOrDislikeBefore(userId, false))
            {
                postFound.dislike = postFound.dislike.filter(element => element != userId);
            }
            postFound.like.push(userId);
            await postFound.save();
            return res.send("You likes the post");
        }
        else
        {
            return res.status(400).send("You liked it before");
        }
    }
    catch (err)
    {
        return res.status(500).send(err);
    }
}

// POST - Dislike the post
module.exports.dislikeThePost = async function(req, res)
{
    let { _id } = req.params;
    let userId = req.user._id;
    try
    {
        let postFound = await Post.findOne({ _id }).exec();
        if (!postFound.likeOrDislikeBefore(userId, false))
        {
            if (postFound.likeOrDislikeBefore(userId, true))
            {
                console.log("You liked it before, now you are going to dislike");
                postFound.like = postFound.like.filter(element => element != userId);
            }

            postFound.dislike.push(userId);
            await postFound.save();
            return res.send("You dislikes the post");
        }
        else
        {
            return res.status(400).send("You disliked it before");
        }        
    }
    catch (err)
    {
        return res.status(500).send(err);
    }
}

// ------------Reply------------
// POST - Reply a post, by using the post _id
module.exports.replyPost = async function(req, res)
{
    let userId = req.user._id;
    let { content } = req.body;
    let { _postId } = req.params
    let newReply = new Reply({ userId, content});
    try
    {
        let post = await Post.findOne({ _id: _postId}).exec();
        post.reply.push(newReply);
        post.lastUpdated = new Date();
        await post.save();
        return res.send("The user replies to the post successfully");
    }
    catch (err)
    {
        return res.status(500).send("Can't reply the post");
    }
}

// POST - Like a reply
module.exports.likeTheReply = async function(req, res)
{
    let { _id, replyIndex} = req.params;
    let userId  = req.user._id;
    try
    {
        let postFound = await Post.findOne({ _id }).exec();
        console.log(postFound.reply[replyIndex]);
        if (!postFound.reply[replyIndex].likeOrDislikeBefore(userId, true))
        {
            if (postFound.reply[replyIndex].likeOrDislikeBefore(userId, false))
            {
                postFound.reply[replyIndex].dislike = postFound.reply[replyIndex].dislike.filter(element => element != userId);
            }
            postFound.reply[replyIndex].like.push(userId);
            await postFound.save();
            return res.send("You likes the reply");
        }
        else
        {
            return res.status(400).send("You liked it before");
        }
    }
    catch (err)
    {
        return res.status(500).send(err);
    }
}

// POSt - Dislike a reply
module.exports.dislikeTheReply = async function (req, res)
{
    let { _id, replyIndex } = req.params;
    let userId = req.user._id;
    try
    {
        let postFound = await Post.findOne({ _id }).exec();
        if (!postFound.reply[replyIndex].likeOrDislikeBefore(userId, false))
        {
            if (postFound.reply[replyIndex].likeOrDislikeBefore(userId, true))
            {
                postFound.reply[replyIndex].like = postFound.reply[replyIndex].like.filter(element => element != userId);
            }
            postFound.reply[replyIndex].dislike.push(userId);
            await postFound.save();
            return res.send("You dislikes the reply")
        }
        else
        {
            return res.status(400).send("You disliked the reply already");
        }
    }
    catch (err)
    {
        return res.status(500).send(err);
    }
}


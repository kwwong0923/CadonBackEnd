const mongoose = require("mongoose");
const { Schema } = mongoose;
const Reply = require("./reply-model");

const postSchema = new Schema({
        title: 
        {
            type: String,
            required: true,
            minlength: 3,
            maxLength: 30
        },
        content:
        {
            type: String,
            required: true
        },
        category:
        {
            type: String,
            enum: ["Travel", "Food", "Game", "News", "Sport", "Music"]
        },
        creator:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        date:
        {
            type: Date,
            default: Date.now
        },
        lastUpdated:
        {
            type: Date,
            default: Date.now
        },
        like:
        {
            type: [String],
            default: []
        },
        dislike:
        {
            type: [String],
            default: []
        },
        reply:
        {
            type: [Reply.schema],
            default: []
        }
    }
);

postSchema.methods.likeOrDislikeBefore = function(_id, like)
{
    if (like)
    {
        if (this.like.includes(_id))
        {
            return true;
        }
        return false;
    }
    else
    {
        if (this.dislike.includes(_id))
        {
            return true;
        }
        return false;
    }
}
const Post = mongoose.model("Post", postSchema);
module.exports = Post;
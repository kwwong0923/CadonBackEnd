const mongoose = require("mongoose");
const { Schema } = mongoose;

const replySchema = new Schema(
    {
        userId: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        content:
        {
            type:String,
            required: true
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
        date:
        {
            type: Date,
            default: Date.now
        }
    }
);

replySchema.methods.likeOrDislikeBefore = function(_id, like)
{
    if (like)
    {
        if (this.like.includes(_id)) return true;
        return false;
    }
    else
    {
        if (this.dislike.includes(_id)) return true;
        return false;
    }
}
const Reply = mongoose.model("Reply", replySchema);
module.exports = Reply;
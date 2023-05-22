const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema(
    {
        id: 
        {
            type: String,
        },
        username: 
        {
            type: String,
            required: true,
            maxlength: 50,
        },
        email:
        {
            type: String,
            required: true,
        },
        password:
        {
            type: String,
            required: true
        },
        date:
        {
            type: Date,
            default: Date.now
        },
        savedPost:
        {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Post",
            default: [],
        },
        ownedPost:
        {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Post",
            default: []
        }
    }
);

userSchema.methods.comparePassword = async function(password, callback)
{
    let result;
    try
    {
        result = await bcrypt.compare(password, this.password);
        return callback(null, result);
    }
    catch (err)
    {
        return callback(err, result)
    }
};

// Mongoose Middlewares
// Generate ID
userSchema.pre("save", async function(next)
{
    if (this.isNew)
    {
        let usersFound = await User.find({}).exec();
        if (usersFound)
        {
            let nextId = usersFound.length + 1;
            let userId = String(nextId).padStart(6, "0");
            this.id =  userId;
            next();
        }
        else
        {
            this.id = String(1).padStart(6, "0");
            next();
        }
    }    
});

// Generate HashPassword
userSchema.pre("save", async function (next)
{
    if (this.isNew || this.isModified("password"))
    {
        const hashPassword = await bcrypt.hash(this.password, 12);
        this.password = hashPassword;
    }
    next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
const User = require("../models").user;
const jwt = require("jsonwebtoken");
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const bcrypt = require("bcrypt");

// POST - Register a new user
module.exports.registerUser = async function (req, res) {
  // To check if the user input valid
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // To check if the email already exist in the database
  const emailExist = await User.findOne({ email: req.body.email }).exec();
  if (emailExist)
    return res.status(400).send("The email has been registered before, please try to login or register a new one");

  // To check if the user already exist in the database
  const userExist = await User.findOne({ username: req.body.username }).exec();
  if (userExist)
    return res.status(400).send("The username has been registered before, please pick a new one");

  // Create a new User
  let { username, email, password } = req.body;
  let newUser = new User({ username, email, password });
  try 
  {
    let savedUser = await newUser.save();
    return res.send(
      {
        message: `The new user (${newUser.username} is saved)`,
        savedUser,
      });
  } 
  catch (err) 
  {
    return res.status(500).send(
      {
        message: "Unable to save",
        err
      }
    );
  }
};

// POST - Login User
module.exports.loginUser = async function (req, res)
{
  // check the user input
  let { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check is the user exist
  let foundUser = await User.findOne({ email: req.body.email}).exec();
  if (!foundUser) return res.status(400).send("The user isn't exist");

  foundUser.comparePassword(req.body.password, (err, isMatch) =>
  {
    if (err) return res.status(500).send(err);

    if (isMatch)
    {
      // Create JWT
      const tokenObject = {
        _id: foundUser._id,
        email: foundUser.email
      };
      
      // Signing
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
      return res.send(
        {
          message: "Login Successfully",
          token: "JWT " + token,
          user: foundUser
        }
      )
    }
    else
    {
      return res.status(401).send("Invalid Password");
    }
  })
}

// PATCH - Edit Username
module.exports.editUsername = async function(req, res)
{
  let { _id } = req.params;
  if ( _id != req.user._id)
  {
    return res.status(400).send("You can't edit other user");
  }
  let { username } = req.body
  try
  {
    let foundUsername = await User.findOne({ username }).exec();
    if (foundUsername)
    {
      return res.status(400).send("The user is used");
    }
    
    let foundUser = await User.findOneAndUpdate({ _id }, { username }, {
      runValidators: true,
      new: true,
    });
    return res.send(
      {
        message: "Username Updated",
        foundUser,
      }
    )
  }
  catch (err)
  {
    return res.status(500).send(err)
  }
}

module.exports.editPassword = async function(req, res)
{
  let { _id } = req.params;
  if (_id != req.user._id)
  {
    return res.status(400).send("You can't edit other user");
  }

  let { password } = req.body;
  let hashPassword = await bcrypt.hash(password, 12)
  try
  {
    let foundUser = await User.findOneAndUpdate({ _id }, { password: hashPassword }, {
      runValidators: true,
      new: true,
    } )
    return res.send({
      message: "Password updated",
      foundUser
    })
  }
  catch (err)
  {
    return res.status(500).send(err)
  }
}
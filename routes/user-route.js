const router = require("express").Router();
// Controllers
const userController = require("../controllers").userController;
router.use((req, res, next) => 
{
  console.log("----------Enter User Route----------");
  next();
});

// POST
// To Register a new user
router.post("/register", userController.registerUser);

// To Login a user
router.post("/login", userController.loginUser);


module.exports = router;

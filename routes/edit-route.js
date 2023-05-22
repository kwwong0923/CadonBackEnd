const router = require("express").Router();
const userController = require("../controllers").userController;

router.patch("/username/:_id", userController.editUsername);

router.patch("/password/:_id", userController.editPassword);

module.exports = router;

// this is routes for all the user's related requests

const express = require("express");
const detailValidation = require("../middlewares/detailValidation");
const userController = require("../controllers/userController");
const validateToken = require("../middlewares/validateToken");
const router = express.Router();

router.post("/registerUser", detailValidation, userController.registerUser);
router.post("/loginUser", userController.loginUser);
router.get("/getUser/:id?", validateToken, userController.getUser);
router.delete("/deleteUser", validateToken, userController.deleteUser);
router.post("/forgotPassword", validateToken, userController.forgotPassword);
router.patch(
  "/resetPassword/:token",
  validateToken,
  userController.resetPassword
);

module.exports = router;

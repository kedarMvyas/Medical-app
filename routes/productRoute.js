/**
 * this is products router
 * this stores all the routes which product property handles
 * there is routes for product, product types, product like-dislike, product comments
 * most liked product and also most disliked product
 */

const express = require("express");
const validateToken = require("../middlewares/validateToken");
const productController = require("../controllers/productController");
const productTypeController = require("../controllers/productTypeController");
const likeDislikeController = require("../controllers/likeDislikeController");
const comment = require("../controllers/comment");
const uploadPhoto = require("../middlewares/uploadPhoto");
const productDetailValidation = require("../middlewares/productDetailValidation");
const router = express.Router();

// product router
router.post(
  "/createProduct",
  validateToken,
  uploadPhoto,
  productDetailValidation,
  productController.createProduct
);
router.patch(
  "/updateProductById/:id",
  validateToken,
  uploadPhoto,
  productController.updateProductById
);

router.delete(
  "/deleteProductById/:id",
  validateToken,
  productController.deleteProductById
);
router.get("/getAllProducts", validateToken, productController.getAllProducts);
router.get(
  "/mostRecentProduct",
  validateToken,
  productController.mostRecentProduct
);

// product type router
router.post(
  "/createProductType",
  validateToken,
  productTypeController.createProductType
);
router.get(
  "/getAllProductType",
  validateToken,
  productTypeController.getAllProductType
);
router.delete(
  "/deleteProductTypeById/:id",
  validateToken,
  productTypeController.deleteProductTypeById
);
router.get(
  "/productsByProductType",
  validateToken,
  productTypeController.productsByProductType
);

// like Dislike routes

router.post("/likeProduct/:id", validateToken, likeDislikeController.like);
router.post(
  "/dislikeProduct/:id",
  validateToken,
  likeDislikeController.disLike
);

// comment route
router.post("/comment/:id", validateToken, comment);

// getMostLiked and mostDisliked product route
router.post(
  "/mostlikedproduct",
  validateToken,
  likeDislikeController.mostLikedProduct
);
router.post(
  "/mostdislikedproduct",
  validateToken,
  likeDislikeController.mostDislikedProduct
);

module.exports = router;

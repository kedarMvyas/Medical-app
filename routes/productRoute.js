const express = require("express");
const validateToken = require("../middlewares/validateToken");
const productController = require("../controllers/productController");
const productTypeController = require("../controllers/productTypeController");
const multer = require("multer");
const uploadPhoto = require("../middlewares/uploadPhoto");
const router = express.Router();

// product router
router.post(
  "/createProduct",
  validateToken,
  uploadPhoto,
  productController.createProduct
);
router.patch("/updateProduct", validateToken, productController.updateProduct);
router.delete("/deleteProduct", validateToken, productController.deleteProduct);
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
  "/deleteProductType",
  validateToken,
  productTypeController.deleteProductType
);
router.get(
  "/productsByProductType",
  validateToken,
  productTypeController.productsByProductType
);

module.exports = router;

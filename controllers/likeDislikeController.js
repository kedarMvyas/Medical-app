// this controller adds like, dislike and calculates mostLike and dislike

const asyncHandler = require("express-async-handler");
const Product = require("../models/product");
const AppError = require("../ErrorHandlers/AppError");
const Like = require("../models/like");
const Dislike = require("../models/disLike");

///////////////////////////////////////////////////////////////////////////

// adds like on product by id
const like = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const product = await Product.findById(id);
  if (!product) return next(new AppError("Product does not exists", 403));

  const existingLike = await Like.findOne({
    user_id: req.user.id,
    product_id: product.id,
  });

  if (existingLike) {
    return res.status(400).json({
      msg: "You have already liked the product",
    });
  }

  const addLike = new Like({ user_id: req.user.id, product_id: product.id });
  const created = await addLike.save();

  if (created) {
    // deleting dislike
    await Dislike.findOneAndDelete({
      user_id: req.user.id,
      product_id: product.id,
    });

    res.json({
      msg: "U have successfully like the product",
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

///////////////////////////////////////////////////////////////////////////

// adds dislike on product by id
const disLike = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const product = await Product.findById(id);

  if (!product) return next(new AppError("Product does not exists", 403));

  const existingDislike = await Dislike.findOne({
    user_id: req.user.id,
    product_id: product.id,
  });

  if (existingDislike)
    return res.status(400).json({
      message: "Product already disliked by this user",
    });

  const addDislike = new Dislike({
    user_id: req.user.id,
    product_id: product.id,
  });
  const created = await addDislike.save();

  if (created) {
    // deleting like

    await Like.findOneAndDelete({
      user_id: req.user.id,
      product_id: product.id,
    });

    res.json({
      msg: "U have successfully dislike the product",
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

///////////////////////////////////////////////////////////////////////////

// calculates most liked product
// also takes an optional query by user to limit likes
const mostLikedProduct = asyncHandler(async (req, res, next) => {
  const query = req.query.limit || 1;
  if (isNaN(query)) return next(new AppError("Query must be a Number"));

  const temp = await Like.aggregate([
    {
      $group: {
        _id: "$product_id",
        count: { $sum: 1 }, // counting no. of documents pass
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: +query,
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      // seperate from array
      $unwind: "$product",
    },
    {
      $project: {
        _id: "$product._id",
        total_likes: "$count",
        name: "$product.name",
        price: "$product.price",
        expiryDate: "$product.expiryDate",
        recommendedDose: "$product.recommendedDose",
      },
    },
  ]).exec();

  if (temp) {
    res.json({
      output: temp,
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

///////////////////////////////////////////////////////////////////////////

// calculates most disliked product
// also takes an optional query by user to limit dislikes
const mostDislikedProduct = asyncHandler(async (req, res, next) => {
  const query = req.query.limit || 1;
  if (isNaN(query)) return next(new AppError("Query must be a Number"));
  const temp = await Dislike.aggregate([
    {
      $group: {
        _id: "$product_id",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: +query,
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $project: {
        _id: "$product._id",
        total_dislikes: "$count",
        name: "$product.name",
        price: "$product.price",
        expiryDate: "$product.expiryDate",
        recommendedDose: "$product.recommendedDose",
      },
    },
  ]).exec();

  if (temp) {
    res.json({
      output: temp,
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

///////////////////////////////////////////////////////////////////////////

module.exports = { like, disLike, mostLikedProduct, mostDislikedProduct };

///////////////////////////////////////////////////////////////////////////

/*
 await Like.aggregate([
    { $match: { isLiked: { $exists: true, $ne: [] } } },

    {
      $group: {
        _id: "$_id",
        totalLikes: { $sum: { $size: "$isLiked" } },
        name: { $first: "$name" },
        size: { $first: "$size" },
        color: { $first: "$color" },
        photo: { $first: "$photo" },
        productType: { $first: "$productType" },
      },
    },

    { $sort: { totalLikes: -1 } },

    { $limit: 1 },
  ]).exec();
 */

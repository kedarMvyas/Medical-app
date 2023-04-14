// this middleware is for image upload and accessing data of form-data

const multer = require("multer");
const AppError = require("../ErrorHandlers/AppError");
const path = require("path");

const directory = path.join(__dirname, "..", "MedicineImages");

const uploadPhoto = (req, res, next) => {
  // this variable is to specify where image must be stored
  // and with what name image must be stored
  const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, directory);
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      cb(null, `meds-${req.body.name}-${Date.now()}.${ext}`);
    },
  });

  // this varible is to check whether user uploads image only
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new AppError("Not an image! Please upload only image", 400), false);
    }
  };

  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  }).single("image");

  // ;

  upload(req, res, (err) => {
    if (err) {
      return next(new AppError(err));
    }
    next();
  });
};

module.exports = uploadPhoto;

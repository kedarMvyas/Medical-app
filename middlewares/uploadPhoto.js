const multer = require("multer");
const AppError = require("../ErrorHandlers/AppError");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../MedicineImages");
  },
  filename: (req, res, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `meds-${req.body.name}-${Date.now()}.${ext}`);
  },
});

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
});

const uploadPhoto = (req, res, next) => {
  //   const upload = multer({ dest: "../MedicineImages" });
  upload.single("photo");
  next();
};
module.exports = uploadPhoto;

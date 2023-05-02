// this is a model for user with all the neccessary details

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add the user name"],
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "Please add the email"],
      unique: [true, "Email address already taken"],
    },
    password: {
      type: String,
      required: [true, "Please fill the password field"],
    },
    passwordConfirm: {
      type: String,
    },
    passwordResetToken: { type: String },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

userSchema.index(
  {
    passwordResetToken: 1,
  },
  {
    expireAfterSeconds: 10,
  }
);

module.exports = new mongoose.model("User", userSchema);

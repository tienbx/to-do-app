const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("email is invalid");
      }
    },
  },

  password: {
    type: String,
    required: true,
    min: 6,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this.id, email: this.email }, "jwtKeyUser");
  return token;
};

const User = mongoose.model("User", userSchema);
module.exports = User;

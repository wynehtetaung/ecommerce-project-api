const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
  googleId: {
    type: String,
  },
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  image: {
    type: String,
  },
  cartData: {
    type: Array,
  },
  type: {
    type: String,
    require: true,
  },
  emailVerified: {
    type: Boolean,
    require: false,
  },
  address: {
    type: String,
  },
  role: {
    type: String,
  },
});

module.exports = mongoose.model("users", userSchema);

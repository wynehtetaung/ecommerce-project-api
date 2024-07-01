const mongoose = require("mongoose");
const schema = mongoose.Schema;

const productSchema = new schema({
  title: {
    type: String,
    require: true,
  },
  old_price: {
    type: Number,
    require: true,
  },
  new_price: {
    type: Number,
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
  showcase: {
    type: Array,
  },
  quantity: {
    type: Number,
  },
  description: {
    type: String,
  },
  size: {
    type: Array,
  },
  available: {
    type: Boolean,
  },
  popular_date: {
    type: Number,
  },
  popular_action: {
    type: Boolean,
  },
});

module.exports = mongoose.model("products", productSchema);

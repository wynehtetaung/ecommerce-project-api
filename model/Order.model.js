const mongoose = require("mongoose");
const schema = mongoose.Schema;

const orderSchema = new schema({
  user_id: {
    type: String,
  },
  user_name: {
    type: String,
  },
  user_address: {
    type: String,
  },
  user_email: {
    type: String,
  },
  order_date: {
    type: String,
  },
  deliver_date: {
    type: String,
  },
  order_status: {
    type: String,
  },
  order_products: {
    type: Array,
  },
  // title: {
  //   type: String,
  // },
  // category: {
  //   type: String,
  // },
  // description: {
  //   type: String,
  // },
  // new_price: {
  //   type: Number,
  // },
  // quantity: {
  //   type: Number,
  // },
  // size: {
  //   type: String,
  // },
  // image: {
  //   type: String,
  // },
});
module.exports = mongoose.model("orders", orderSchema);

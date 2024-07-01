const mongoose = require("mongoose");
const schema = mongoose.Schema;

const adminSchema = new schema({
  name: {
    type: String,
  },
  key: {
    type: String,
  },
});

module.exports = mongoose.model("admin", adminSchema);

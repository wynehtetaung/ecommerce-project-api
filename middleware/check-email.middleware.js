const User = require("../model/User.model");
async function checkEmail(req, res, next) {
  const { name, email } = req.body;
  const checkName = await User.findOne({ name });
  const checkEmail = await User.findOne({ email });
  if (checkEmail || checkName) {
    return res.status(409).json({
      message: "User is already.Try another name.",
    });
  }
  next();
}
module.exports = { checkEmail };

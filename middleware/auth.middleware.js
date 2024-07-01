const jwt = require("jsonwebtoken");
function auth(req, res, next) {
  const { authorization } = req.headers;
  const [type, token] = authorization && authorization.split(" ");
  if (type !== "Bearer") {
    return res.status(401).json({
      success: false,
      message: "Bearer Token required",
    });
  }
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token is required",
    });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
    if (err)
      return res.status(401).json({
        success: false,
        message: "Incorrect token",
      });
    res.locals.user = decode;
    next();
  });
}
module.exports = { auth };

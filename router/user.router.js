const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth.middleware");
const { checkEmail } = require("../middleware/check-email.middleware");
const {
  register,
  login,
  verify,
  userList,
  update,
  remove,
  userCartList,
  deleteUserAccount,
  admin,
  adminLogin,
  OneUser,
  emailVerified,
} = require("../controller/user.controller");

router.get("/", userList);

router.get("/email-verify/:id", emailVerified);

router.get("/user/:id", OneUser);

router.get("/cart-resource/:id", userCartList);

router.put("/update/:id", update);

router.put("/remove/:id", remove);

router.post("/register", checkEmail, register);

router.post("/login", login);

router.get("/admin", admin);

router.post("/admin-login", adminLogin);

router.post("/forget", async (req, res) => {
  const { email } = req.body;
});

router.get("/verify", auth, verify);

router.delete("/:id", deleteUserAccount);

module.exports = router;

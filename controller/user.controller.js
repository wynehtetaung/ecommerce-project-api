const User = require("../model/User.model");
const Admin = require("../model/Admin.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const sendMail = require("../utils/nodemailer.service");

const userList = async (req, res) => {
  const users = await User.find().sort({ _id: -1 });
  res.status(200).json({ users });
};

const OneUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.status(200).json(user);
};

const userCartList = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.status(200).json(user.cartData);
};

const register = async (req, res) => {
  const {
    name,
    email,
    password,
    image,
    cartData,
    type,
    emailVerified,
    googleId,
    address,
  } = req.body;
  const user = new User({
    googleId,
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    image,
    cartData,
    type,
    emailVerified,
    address,
    role: "user",
  });
  user
    .save()
    .then(async (done) => {
      sendMail(
        user.name,
        user.email,
        "Email Account Verify",
        "Click the link below to verify your account",
        `http://localhost:3000/api/v1/user/email-verify/${user._id}`,
        "Verify Your Account"
      );
      res.status(200).json({
        success: true,
        message: "user account created",
        mailMessage: "send message",
        data: done,
      });
    })
    .catch((e) => {
      res.status(500).json({
        success: false,
        message: "internal server error",
        error: e,
      });
    });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "require email and password!",
    });
  }
  const user = await User.findOne({ email });
  if (user.emailVerified === false) {
    return res.status(400).json({
      success: false,
      message: "Your Email Is Not Verify!",
    });
  }
  if (user) {
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          cartData: user.cartData,
          address: user.address,
          type: user.type,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "24h",
        }
      );
      return res.status(200).json({
        success: true,
        token: token,
      });
    }
  } else {
    return res.status(404).json({
      success: false,
      message: "Please Create Your Account",
    });
  }

  return res.status(401).json({
    success: false,
    message: "Incorrect Email or Password",
  });
};

const verify = (req, res) => {
  res.status(200).json(res.locals.user);
};

const update = async (req, res) => {
  const { id } = req.params;
  const { name, cartData, image, password, address } = req.body;
  if (name) {
    await User.findByIdAndUpdate(id, { name: name });
  } else if (cartData) {
    const data = await User.findById(id);
    const check = data.cartData
      .map((item) => item._id === cartData._id && item.size === cartData.size)
      .includes(true);
    if (data.cartData.length == 0 || !check) {
      const updateCartData = [...data.cartData, cartData];
      await User.findByIdAndUpdate(id, { cartData: updateCartData });
    } else {
      const user = await User.findById(id);
      const changeCartData = user.cartData.find(
        (item) => item.size === cartData.size && item._id === cartData._id
      );
      const existsCartData = user.cartData.filter(
        (item) => item.size !== cartData.size || item._id !== cartData._id
      );
      const updateQuantity = {
        quantity: changeCartData.quantity + cartData.quantity,
      };
      const updateCartData = {
        ...changeCartData,
        ...updateQuantity,
      };
      const finalChangeCartData = [...existsCartData, updateCartData];

      await User.findByIdAndUpdate(id, { cartData: finalChangeCartData });
    }
  } else if (image) {
    await User.findByIdAndUpdate(id, { image: image });
  } else if (password) {
    await User.findByIdAndUpdate(id, {
      password: bcrypt.hashSync(password, 10),
    });
  } else if (address) {
    await User.findByIdAndUpdate(id, { address: address });
  }

  const updateUser = await User.findOne({ _id: id });
  res.status(200).json({
    success: true,
    data: updateUser,
  });
};

const remove = async (req, res) => {
  const { id } = req.params;
  const { productId } = req.body;
  if (productId) {
    const user = await User.findById(id);
    const products = user.cartData;
    const filter = products.filter((product) => product.pid !== productId);
    const userProducts = await User.updateOne({ cartData: filter });
    res.status(200).json({
      success: true,
      data: userProducts,
    });
  } else {
    await User.findByIdAndUpdate(id, { cartData: [] });
    const removeData = await User.findById(id);
    res.status(200).json({
      success: true,
      message: "remove item from cart",
      data: removeData,
    });
  }
};

const deleteUserAccount = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.status(204).json("user account deleted!");
};

const adminLogin = async (req, res) => {
  const { password } = req.body;
  const { key } = await Admin.findOne({ name: "Admin" });
  if (key === password) {
    res.status(200).json({
      success: true,
    });
  } else {
    res.status(404).json({
      success: false,
    });
  }
};

const admin = async (req, res) => {
  const admin = await Admin.find();
  const token = jwt.sign({ date: Date.now() }, process.env.SECRET_KEY);
  const updateKey = token.slice(token.length - 8);

  if (admin.length == 0) {
    new Admin({
      name: "Admin",
      key: updateKey,
    })
      .save()
      .then((done) => console.log(done))
      .catch((e) => console.log(e));
  }
  await Admin.findOneAndUpdate({ name: "Admin" }, { key: updateKey });
  const { key } = await Admin.findOne({ name: "Admin" });
  await res.status(200).json(key.split("").reduce((a, b) => b + a));
};

const emailVerified = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndUpdate(id, { emailVerified: true });
  await res.redirect(process.env.CLIENT_REDIRECT_URL + "/login");
};

module.exports = {
  register,
  login,
  verify,
  userList,
  OneUser,
  update,
  remove,
  userCartList,
  deleteUserAccount,
  admin,
  adminLogin,
  emailVerified,
};

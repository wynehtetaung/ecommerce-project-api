const express = require("express");
const Product = require("../model/Product.model");
const Order = require("../model/Order.model");
const { ObjectId } = require("mongodb");
const sendMail = require("../utils/nodemailer.service");
const moment = require("moment");

const addProduct = (req, res) => {
  const {
    title,
    old_price,
    new_price,
    category,
    image,
    showcase,
    size,
    description,
    available,
  } = req.body;

  const product = new Product({
    title,
    old_price,
    new_price,
    category,
    image,
    showcase,
    size,
    description,
    available,
    popular_date: Date.now(),
    popular_action: false,
  });
  product
    .save()
    .then((done) => {
      res.status(200).json({
        success: true,
        message: "product created",
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

const productList = async (req, res) => {
  const { limit, category, admin } = req.query;
  if (category && limit) {
    const products = await Product.find({ available: true, category: category })
      .sort({ _id: -1 })
      .limit(limit);
    res.status(200).json({
      success: true,
      data: products,
    });
  } else if (admin) {
    const products = await Product.find().sort({ _id: -1 });
    res.status(200).json({
      success: true,
      data: products,
    });
  } else {
    const products = await Product.find({ available: true }).sort({ _id: -1 });
    res.status(200).json({
      success: true,
      data: products,
    });
  }
};

const newProducts = async (req, res) => {
  const products = await Product.find({ available: true })
    .sort({ _id: -1 })
    .limit(8);
  res.status(200).json({
    success: true,
    data: products,
  });
};

const productWithId = async (req, res) => {
  const { pid } = req.query;
  const product = await Product.findOne({ _id: new ObjectId(pid) });
  res.status(200).json({
    success: true,
    message: "id",
    data: product,
  });
};

const productDataChange = async (req, res) => {
  const { id } = req.params;
  const { action, date, available_value } = req.body;
  if (available_value === true || available_value === false) {
    await Product.findByIdAndUpdate(id, {
      available: available_value,
    });
    const products = await Product.find().sort({ _id: -1 });
    res.status(200).json(products);
  } else {
    await Product.findByIdAndUpdate(id, {
      popular_action: action,
      popular_date: date,
    });
    res.status(200).json("updated");
  }
};

const productDelete = async (req, res) => {
  const { id } = req.params;
  await Product.deleteOne({ _id: new ObjectId(id) });
  res.status(204).json({
    success: true,
  });
};

const popularProduct = async (req, res) => {
  const { limit } = req.query;
  if (limit) {
    const popular = await Product.find({
      available: true,
      popular_action: true,
    })
      .sort({
        popular_date: -1,
      })
      .limit(limit);
    res.status(200).json({
      success: true,
      data: popular,
    });
  } else {
    const popular = await Product.find({
      popular_action: true,
    });
    res.status(200).json({
      success: true,
      data: popular,
    });
  }

  // const popular = products.filter((product) => product.popular.action === true);
};

const filterProduct = async (req, res) => {
  const { category } = req.query;
  const filterProduct = await Product.find({ category: category });
  res.status(200).json({
    success: true,
    data: filterProduct,
  });
};

const orderProduct = async (req, res) => {
  const {
    user_id,
    user_name,
    user_email,
    user_address,
    order_products,
    order_date,
    order_status,
  } = req.body;
  const order = new Order({
    user_id,
    user_name,
    user_address,
    user_email,
    order_products,
    order_date,
    deliver_date: "",
    order_status,
  });
  order
    .save()
    .then((done) => {
      res.status(200).json({
        success: true,
        message: "add request order",
        data: done,
      });
    })
    .catch((err) =>
      res.status(500).json({
        success: false,
        message: "internal server error",
        error: err,
      })
    );
};

const orderList = async (req, res) => {
  const result = await Order.find().sort({ _id: -1 });
  res.status(200).json(result);
};

const orderListWithId = async (req, res) => {
  const { id } = req.params;
  const result = await Order.findById(id);
  res.status(200).json(result);
};

const orderUpdate = async (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;
  const order = await Order.findById(id);
  sendMail(
    order.user_name,
    order.user_email,
    "Delivery",
    "We have delivered the item you ordered.Sent on " +
      moment().format("dddd,MMMM,YYYY, h:mm a"),
    "https://localhost:4000",
    "Go to Website"
  );
  await Order.findByIdAndUpdate(id, { order_status: orderStatus });
  const orders = await Order.find().sort({ id: -1 });
  res.status(200).json(orders);
};

const orderDelete = async (req, res) => {
  const { id } = req.params;
  await Order.findByIdAndDelete(id);
  res.status(204).json({
    message: "order deleted!",
  });
};

module.exports = {
  addProduct,
  productList,
  productDelete,
  productWithId,
  newProducts,
  productDataChange,
  filterProduct,
  popularProduct,
  orderProduct,
  orderList,
  orderListWithId,
  orderDelete,
  orderUpdate,
};

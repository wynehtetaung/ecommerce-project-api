require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./router/user.router");
const productRouter = require("./router/product.router");

// get json data from req
app.use(express.json());

// cors setup
app.use(
  cors({
    origin: "http://localhost:4000" && "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  })
);

// router setup
app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);

// mongo setup
mongoose
  .connect(process.env.MONGO_ATLAS_STR)
  .then((res) => {
    console.log(`mongodb connect!`);
  })
  .catch((e) => console.log(`mongodb error : ${e}`));

app.listen(process.env.PORT, (err) => {
  if (err) console.log(`Error : ${err}`);
  console.log(`server is running at ${process.env.PORT}`);
});

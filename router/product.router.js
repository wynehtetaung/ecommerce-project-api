const express = require("express");
const {
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
} = require("../controller/product.controller");
const router = express.Router();

router.get("/", productList);
router.get("/new-collections", newProducts);
router.get("/id", productWithId);
router.get("/popular", popularProduct);
router.get("/filter", filterProduct);
router.get("/order-list", orderList);
router.get("/order-list/:id", orderListWithId);
router.patch("/:id", productDataChange);
router.post("/add", addProduct);
router.post("/order", orderProduct);
router.put("/order/:id", orderUpdate);
router.delete("/:id", productDelete);
router.delete("/order/:id", orderDelete);

module.exports = router;

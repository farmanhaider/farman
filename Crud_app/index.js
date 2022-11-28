const express = require("express");
const {
  Saveproduct,
  Getallproducts,
  editProductPage,
  deleteProduct,
} = require("./Controller/productcontroller");
const router = express.Router();
router.get("/", (req, res) => {
  res.render("index", { Title: "Crud application", prods: "" });
});
router.get("/addproduct", (req, res) => {
  res.render("add");
});
router.get("/edit/:id", editProductPage);

router.post("/edit-data", (req, res) => {
  let bodyData = req.body;
  res.render("index");
});
router.post("/addedproduct", Saveproduct);
//router.get("/getproductbyid/:id", Getproductbyid);
router.get("/getproducts", Getallproducts);
module.exports = router;
router.get("/delete", deleteProduct);

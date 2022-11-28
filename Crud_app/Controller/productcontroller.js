const { pid } = require("process");
const proModel = require("../Model/product");
function Saveproduct(req, res) {
  const bodyData1 = req.body;
  console.log(bodyData1);
  let ins = new proModel(bodyData1);
  ins.save((err) => {
    if (err) res.send("something wet wrong or Already exist");
    else {
      res.render("index", {
        Title: "",
      });
    }
  });
}
/*async function Getproductbyid() {
  let proId = req.params.id;
  let product = await proModel.findById(proId);
  if (!product) {
    res.status(404).send("product with id is not found");
  } else {
    res.send(product);
  }
}*/
function editProductPage(req, res, next) {
  let prodId = req.params.id;
  proModel
    .findById(prodId)
    .then((product) => {
      res.render("edit", {
        product: product,
        path: "/",
        pageTitle: "Edit Product",
        name: "Tina",
      });
    })
    .catch((err) => console.log(err));
}
function deleteProduct(req, res, next) {
  // Product.deleteOne({ _id: req.body.id }) //deleteOne mongodb
  // Product.findByIdAndDelete(req.body.id) //findOneAndDelete
  let pid = req.body.id;
  proModel
    .deleteOne(pid) //findAndModify
    .then((result) => {
      res.redirect("/getproducts");
    })
    .catch((err) => console.log(err));
}
function Getallproducts(req, res, next) {
  proModel
    .find()
    .then((products) => {
      res.render("index", {
        Title: "Crud application",
        prods: products,
        path: "/",
        pageTitle: "Home",
      });
    })
    .catch((err) => console.log(err));
}

module.exports = { Saveproduct, Getallproducts, editProductPage, deleteProduct};

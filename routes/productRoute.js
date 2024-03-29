const express = require("express");
const {createProduct, getProduct, getAllProduct, updateProduct, deleteProduct} = require("../controllers/productCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/",authMiddleware,isAdmin,createProduct);
router.get("/:id",getProduct);
router.get("/", getAllProduct);
router.put("/:id",authMiddleware,isAdmin, updateProduct);
router.delete("/:id",authMiddleware,isAdmin, deleteProduct);

module.exports = router
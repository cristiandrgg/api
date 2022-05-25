const Product = require("../models/Product");
const { vrfTok, vrfTokAuth, vrfTokAdmin } = require("./vrfTok");

const router = require("express").Router();

//Create New Product

router.post("/", vrfTokAdmin, async (req, res) => {
    const newProd = new Product(req.body);
    try {
      const savedProd = await newProd.save();
      res.status(200).json(savedProd);
    }catch (err) {
      res.status(500).json(err);
    }
  });

//Upate Product

router.put("/:id", vrfTokAdmin, async (req, res) => {
    try {
      const updatedProd = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedProd);
    }catch (err) {
      res.status(500).json(err);
    }
  });
  
  //Delete Product

  router.delete("/:id", vrfTokAdmin, async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.status(200).json("Product deleted");
    }catch (err) {
      res.status(500).json(err);
    }
  });
  
  //Get Product

  router.get("/find/:id", async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //All Products
  router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
      let products;
  
      if (qNew) {
        products = await Product.find().sort({ createdAt: -1 }).limit(1);
      } else if (qCategory) {
        products = await Product.find({
          categories: {
            $in: [qCategory],
          },
        });
      } else {
        products = await Product.find();
      }
  
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  module.exports = router;

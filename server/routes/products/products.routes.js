const express = require("express");
const productsModel = require("../../models/products.model");
const cloudinary = require("../../utils/cloudinary");
const productValidation = require("../../validation/product/product.validate");
const admin = require("../../middleware/admin.middleware");
const userModel = require("../../models/user.model");
const Router = express.Router();

// CREATE HOUSE
Router.post("/createproduct", admin, async (req, res) => {
  const { error } = productValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const images = [];
    [...req.body.image].map(async (img) => {
      return new Promise((resolve) => {
        return resolve(
          cloudinary.uploader.upload(img, {
            upload_preset: "fanakaplatinums",
          })
        );
      })
        .then((response) => {
          images.push(response);
        })
        .catch((err) => {
          res.status(400).json({ message: err.message });
        });
    });
    setTimeout(async () => {
      await productsModel.create({
        name: req.body.name,
        location: req.body.location,
        description: req.body.description,
        price: req.body.price,
        amenities: req.body.amenities,
        image: images,
      });
      console.log("house created successfully");
      res.status(200).json({ message: "house created successfully" });
    }, 10000);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ALL HOUSES
Router.get("/getallproducts", async (_req, res) => {
  try {
    const products = await productsModel.find();
    if (products) {
      return res.status(200).json(products);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET SINGLE HOUSE
Router.get("/find/:id", async (req, res) => {
  try {
    const product = await userModel.findById(req.params.id);
    if (product) {
      return res.status(200).json(product);
    }
  } catch (error) {
    res.status(500).json({ message: error.mesage });
  }
});

// UPDATE HOUSE
Router.put("/:id", async (req, res) => {
  try {
    if (req.body.productImg) {
      const destroyRes = await cloudinary.uploader.destroy(
        req.body.product.image.id
      );
      if (destroyRes) {
        const uploadRes = await cloudinary.uploader.upload(
          req.body.productImg,
          {
            upload_preset: "fanakaplatinums",
          }
        );
        if (uploadRes) {
          const updatedProduct = await productsModel.findByIdAndUpdate(
            req.params.id,
            {
              $set: {
                ...req.body.product,
                image: uploadRes,
              },
            },
            {
              new: true,
            }
          );
          res.status(200).send(updatedProduct);
        } else {
          try {
            const updatedProduct = await productsModel.findByIdAndUpdate(
              req.params.id,
              {
                $set: req.body.product,
              },
              {
                new: true,
              }
            );
            res.status(200).send(updatedProduct);
          } catch (error) {}
        }
      }
    }
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

// DELETE HOUSE
Router.delete("/:id", admin, async (req, res) => {
  try {
    const product = await productsModel.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ message: "house not found" });
    }
    if (product.image.id) {
      const destroyRes = await cloudinary.uploader.destroy(product.image.id);
      if (destroyRes) {
        const deletedProduct = await productsModel.findByIdAndDelete(
          req.params.id
        );
        res.status(200).send(deletedProduct);
      }
      return res.status(200).send({ messgae: "house deleted successfully" });
    }
  } catch (error) {
    res.status(500).send({ mesage: error });
  }
});

module.exports = Router;

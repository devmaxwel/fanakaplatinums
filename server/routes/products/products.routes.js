const express = require("express");
const productsModel = require("../../models/products.model");
const cloudinary = require("../../utils/cloudinary");
const productValidation = require("../../validation/product/product.validate");
const admin = require("../../middleware/admin.middleware");
const userModel = require("../../models/user.model");
const Router = express.Router();

// CREATE PRODUCT
Router.post("/createproduct", admin, async (req, res) => {
  const { error } = productValidation.validate(req.body);
  if (error) {
    res.status(400).send({ message: error.details[0].message });
  } else {
    try {
      if (req.body.image) {
        const uploadRes = await cloudinary.uploader
          .upload(req.body.image, {
            upload_preset: "fanakaplatinums",
          })
          .catch((err) => {
            res.status(500).send({ message: err });
          });
        if (uploadRes) {
          const product = await productsModel.create({
            name: req.body.name,
            location: req.body.location,
            description: req.body.description,
            price: req.body.price,
            amenities: req.body.amenities,
            image: [
              {
                id: uploadRes.public_id,
                name: uploadRes.original_filename,
                url: uploadRes.url,
                secure_url: uploadRes.secure_url,
              },
            ],
          });
          if (product) {
            return res
              .status(200)
              .send({ message: "house was created and saved" });
          }
        }
        return;
      }
    } catch (error) {
      res.status(500).send({ message: error });
    }
  }
});

// GET ALL PRODUCTS
Router.get("/getallproducts", async (_req, res) => {
  try {
    const products = await productsModel.find();
    if (products) {
      return res.status(200).send(products);
    }
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

// GET PRODUCT
Router.get("/find/:id", async (req, res) => {
  try {
    const product = await userModel.findById(req.params.id);
    if (product) {
      return res.status(200).send(product);
    }
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

// UPDATE PRODUCT
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
                image: [
                  {
                    id: uploadRes.public_id,
                    name: uploadRes.original_filename,
                    url: uploadRes.url,
                    secure_url: uploadRes.secure_url,
                  },
                ],
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

// DELETE PRODUCT
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

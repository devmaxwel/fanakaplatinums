const express = require("express");
const productsModel = require("../../models/products.model");
const cloudinary = require("../../config/cloudinary");
const productValidation = require("../../validation/product/product.validate");
const host = require("../../middleware/host.middleware");
const Router = express.Router();

// CREATE HOUSE
Router.post("/createproduct", host, async (req, res) => {
  const { error } = productValidation.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    console.log(error.details[0].message);
    return;
  } else {
    try {
      const images = [];
      const cloudinarySavepromises = [...req.body.image].map(async (img) => {
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
            res.status(400).json({ message: err });
          });
      });
      await Promise.all(cloudinarySavepromises);
      await productsModel
        .create({
          hosting_user_id: req.user.id,
          property_name: req.body.name,
          property_location: req.body.location,
          property_description: req.body.description,
          property_price: req.body.price,
          property_amenities: req.body.amenities,
          property_images: images,
        })
        .catch((err) => {
          console.log(err.message);
        });
      console.log("house created successfully");
      res.status(200).json({ message: "house created successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.log(error);
    }
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
    const product = await productsModel.findById(req.params.id);
    if (product) {
      return res.status(200).send(product);
    }
  } catch (error) {
    res.status(500).send({ message: error.mesage });
  }
});

// UPDATE HOUSE
Router.put("/:id", host, async (req, res) => {
  let cloudinaryDeletedResponse;
  if (req.body.imageupdate) {
    cloudinaryDeletedResponse = [...req.body.image].map((img) => {
      return new Promise((resolve) => {
        return resolve(cloudinary.uploader.destroy(img));
      });
    });
    await Promise.all(cloudinaryDeletedResponse);
    const images = [];
    const cloudinarySavepromises = [...req.body.imageupadte].map(
      async (img) => {
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
            res.status(400).json({ message: err });
          });
      }
    );
    await Promise.all(cloudinarySavepromises);
    await productsModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...req.body,
          image: images,
        },
      },
      { new: true }
    );
    res.status(200).json({ message: "house has been updated successfully" });
  } else {
    try {
      await productsModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            ...req.body,
          },
        },
        { new: true }
      );
      res.status(200).json({ message: "house was updated succefully" });
    } catch (error) {
      res.status(500).json({ message: `an error oaccured: ${error.message}` });
    }
  }
});

// DELETE HOUSE
Router.delete("/:id", host, async (req, res) => {
  try {
    const product = await productsModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "house not found" });
    }
    const cloudinaryDeletedResponse = [...product.image].map(async (img) => {
      return new Promise((resolve) => {
        resolve(cloudinary.uploader.destroy(img.public_id));
      }).catch((err) => {
        res.status(500).json(err);
        console.log(err);
      });
    });
    await Promise.all(cloudinaryDeletedResponse);
    await productsModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "house deleted successfully" });
    console.log("this house was deleted", onfullfilled);
  } catch (error) {
    res.status(500).send({ mesage: error });
  }
});

module.exports = Router;

const express = require("express");
const authenticated = require("../../middleware/authenticated.middleware");
const wishlistModel = require("../../models/whishlist.models");
const Router = express.Router();

// Create wish list
Router.post("/createwish", authenticated, async (req, res) => {
  try {
    await wishlistModel.create({
      wishlist: req.body.house,
    });
    res.status(200).json({ message: "your wishlist was created" });
  } catch (error) {
    res.status(500).json({ message: `an error occurred: ${error.message}` });
  }
});

// Get Single Wish
Router.get("find/:id", authenticated, async (req, res) => {
  try {
    const wishlist = await wishlistModel.findById(req.params.id);
    if (wishlist) {
      return res.status(200).json(wishlist);
    }
  } catch (error) {
    res.status(500).json({ message: `an error occured, ${error.message}` });
  }
});

//Get all Wishlists
Router.get("/getallwishlist", authenticated, async (req, res) => {
  try {
    const wishlists = await wishlistModel.find();
    if (wishlists) {
      return res.status(200).json(wishlists);
    }
  } catch (error) {
    res.status(500).json({ message: `an error occurred, ${error.message}` });
  }
});

// Clear Wish List
Router.delete("/:id", authenticated, async (req, res) => {
  try {
    await wishlistModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "wish cleared successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: `internal server error, ${error.message}` });
  }
});

module.exports = Router;

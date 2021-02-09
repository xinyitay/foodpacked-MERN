const express = require("express");
const mongoose = require("mongoose");

const Listing = require("../models/listingModel.js")(mongoose);

// use Mongoose helper functions for CRUD operations. Returns mongoose Query object.

// Create & save listing
exports.create = (req, res) => {
  // validate request
  if (!req.body.shopName) {
    res.status(400).send({ message: "Content is empty!" });
    return;
  }

  // Create Listing
  const listing = new Listing({
    shopName: req.body.shopName,
    itemName: req.body.itemName,
    price: req.body.price,
    available: req.body.available ? req.body.available : false,
  });

  // Save tutorial
  listing
    .save(listing)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: err.message || "Failed to create listing!" });
    });
};

// Retrieve all listings
exports.retrieve = (req, res) => {
  // use req.query.shopName to get query string from Request.
  // use it as condition for retrieveAll method.
  const shopName = req.body.shopName;
  var condition = shopName
    ? { shopName: { $regex: new RegExp(shopName), $options: "i" } }
    : {};

  // find all documents that match
  // If there are too many documents in the result to fit in memory, use Query.prototype.cursor()
  Listing.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Failed to retrieve listings!",
      });
    });
};

// Find a single listing using ID
// may not be needed if finding by shopName/itemName later on FE
exports.retrieveById = (req, res) => {
  const id = req.params.id;

  Listing.findById(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Listing not found! (Listing ID: ${id})`,
        });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Error in retrieving listing! (Listing ID: ${id})`,
      });
    });
};

// Update listing by ID in request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Empty field detected!" });
  }
  const id = req.params.id;

  Listing.findByIdAndUpdate(id, req.body, {
    useFindAndModify: false,
  })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Listing not found. Cannot update listing! (Listing ID: ${id}).`,
        });
      } else {
        res.send({
          message: `Hello I am the backend! Listing updated successfully! ${data}`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Error updating listing. (Listing ID: ${id}).`,
      });
    });
};

// Delete listing
exports.delete = (req, res) => {
  const id = req.params.id;

  Listing.findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Listing with id ${id} not found. Unable to delete!`,
        });
      } else {
        const shopName = data.shopName;
        const itemName = data.itemName;
        res.send({
          message: `Deleted ${itemName} from ${shopName} (Listing ID: ${id})!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Could not delete listing (Listing ID: ${id}).`,
      });
    });
};

// find all listings that are available
exports.retrieveAvailable = (req, res) => {
  Listing.find({ available: true })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Unable to retrieve!",
      });
    });
};

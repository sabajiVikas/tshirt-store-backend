const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

const Product = require("../models/product");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("Category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "unable to find product...",
        });
      }

      req.product = product;
      next();
    });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;

  return res.status(200).json(req.product);
};

exports.getCategories = (req, res) => {
  Product.distinct("category", {}, (err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "unable to find categories",
      });
    }

    return res.status(200).json(categories);
  });
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);

    return res.send(req.product.photo.data);
  }
  next();
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with file...",
      });
    }

    // checks
    const { name, description, price, category, stock } = fields;
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "all fields are required...",
      });
    }

    let product = new Product(fields);

    // image handing
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "file is too big to process...",
        });
      }

      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // save
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "unable to save fields & image in database",
        });
      }

      res.status(200).json(product);
    });
  });
};

exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with file...",
      });
    }

    // updation
    let product = req.product;
    product = _.extend(product, fields);

    // image handing
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "file is too big to process...",
        });
      }

      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // save
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "unable to update fields & image in database",
        });
      }

      res.status(200).json(product);
    });
  });
};

exports.deleteProduct = (req, res) => {
  let product = req.product;

  product.remove((err, deletedProdcut) => {
    if (err) {
      return res.status(400).json({
        error: "deletion failed",
      });
    }

    return res.status(200).json({
      message: "product deleted successfully",
      product: deletedProdcut.name,
    });
  });
};

exports.getProducts = (req, res) => {
  let limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "products not found...",
        });
      }

      return res.status(200).json(products);
    });
};

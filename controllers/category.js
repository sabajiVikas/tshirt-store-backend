const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    if (err) {
      return res.status(400).json({
        error: "categories not found",
      });
    }

    req.category = cate;
    next();
  });
};

exports.getCategories = (req, res) => {
  Category.find({}, (err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "categories not found...",
      });
    }

    return res.status(200).json(categories);
  });
};

exports.getCategory = (req, res) => {
  return res.status(200).json(req.category);
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);

  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "saving of category failed",
      });
    }

    return res.status(200).json(category);
  });
};

exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;
  category.save((err, updatedCategory) => {
    if (err) {
      return res.status(400).json({
        error: "updatation of category failed",
      });
    }

    return res.status(200).json(updatedCategory);
  });
};

exports.deleteCategory = (req, res) => {
  const category = req.category;

  category.remove((err, category) => {
    if (err) {
      return res.status(200).json({
        error: "unable to delete category...",
        category: category.name,
      });
    }

    return res.status(200).json({
      message: "deletion success",
      category: category.name,
    });
  });
};

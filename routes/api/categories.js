var router = require('express').Router();
var mongoose = require('mongoose');
var Category = mongoose.model('Category');


// Preload category objects on routes with ':category'
router.param('category', function (req, res, next, slug) {
  Category.findOne({ slug: slug })
    .then(function (category) {
      if (!category) {
        return res.sendStatus(404);
      }

      req.category = category;

      return next();
    }).catch(next);
});


// Get categories
router.get('/', function (req, res, next) {
  var query = {};
  var limit = 20;

  if (typeof req.query.limit !== 'undefined') {
    limit = req.query.limit;
  }

  Promise.all([
    Category.find(query)
      .limit(Number(limit))
      .sort({ createdAt: 'desc' })
      .exec(),
    Category.count(query).exec()
  ]).then(function (results) {
    var categories = results[0];
    var categoriesCount = results[1];

    return res.json({
      categories: categories.map(function (category) {
        return category.toJSON();
      }),
      categoriesCount: categoriesCount
    });
  }).catch(next);
});

// Get category
router.get('/:category', function (req, res, next) {
  return res.json({
    category: req.category.toJSON()
  });
});

module.exports = router;

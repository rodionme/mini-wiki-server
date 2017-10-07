let router = require('express').Router();
let mongoose = require('mongoose');
let Category = mongoose.model('Category');


// Preload category objects on routes with ':category'
router.param('category', (req, res, next, slug) => {
  Category.findOne({ slug: slug })
    .then(category => {
      if (!category) {
        return res.sendStatus(404);
      }

      req.category = category;

      return next();
    }).catch(next);
});


// Get categories
router.get('/', (req, res, next) => {
  let query = {};
  let limit = 20;

  if (typeof req.query.limit !== 'undefined') {
    limit = req.query.limit;
  }

  Promise.all([
    Category.find(query)
      .limit(Number(limit))
      .sort({ createdAt: 'desc' })
      .exec(),
    Category.count(query).exec()
  ]).then(results => {
    let categories = results[0];
    let categoriesCount = results[1];

    return res.json({
      categories: categories.map(category => category.toJSON()),
      categoriesCount
    });
  }).catch(next);
});

// Get category
router.get('/:category', (req, res, next) => res.json({
  category: req.category.toJSON()
}));

module.exports = router;

let router = require('express').Router();
let mongoose = require('mongoose');
let Article = mongoose.model('Article');
let Category = mongoose.model('Category');


// Preload article objects on routes with ':article'
router.param('article', (req, res, next, slug) => {
  Article.findOne({ slug: slug })
    .then(article => {
      if (!article) {
        return res.sendStatus(404);
      }

      req.article = article;

      return next();
    }).catch(next);
});


// Get articles
router.get('/', (req, res, next) => {
  let query = {};
  let limit = 20;

  if (typeof req.query.limit !== 'undefined') {
    limit = req.query.limit;
  }

  if (typeof req.query.query !== 'undefined') {
    return Article.where('title', new RegExp(req.query.query, 'i'))
      .then(articles => {
        if (!articles) {
          return res.sendStatus(404);
        }

        return res.json({
          articles: articles.map(article => article.toJSON())
        });
      }).catch(next);
  }

  if (typeof req.query.random !== 'undefined') {
    return Article.count().exec((err, count) => {
      let random = Math.floor(Math.random() * count);

      Article.findOne()
        .skip(random)
        .exec((err, article) => res.json({
          article: article
        }));
    });
  }

  Promise.all([
    Article.find(query)
      .limit(Number(limit))
      .sort({ createdAt: 'desc' })
      .exec(),
    Article.count(query).exec()
  ]).then(function (results) {
    let articles = results[0];
    let articlesCount = results[1];

    return res.json({
      articles: articles.map(article => article.toJSON()),
      articlesCount
    });
  }).catch(next);
});

// Get article
router.get('/:article', (req, res, next) => res.json({
  article: req.article.toJSON()
}));

// Create article
router.post('/', (req, res, next) => {
  let article = new Article(req.body.article);

  Category.findOne({ slug: req.body.article.category })
    .then(category => {
      if (!category) {
        return res.sendStatus(404);
      }

      if (!category.articles) {
        category.articles = [];
      }

      category.articles.push(article);

      category.save(() => {
        article.save().then(() => res.json({ article })).catch(next);
      });
    }).catch(next);
});

// Update article
router.put('/:article', (req, res, next) => {
  if (typeof req.body.article.title !== 'undefined') {
    req.article.title = req.body.article.title;
  }

  if (typeof req.body.article.content !== 'undefined') {
    req.article.content = req.body.article.content;
  }

  if (typeof req.body.article.category !== 'undefined') {
    // Add article to category
    if (req.body.article.category.length) {
      Category.findOne({ slug: req.body.article.category })
        .then(category => {
          if (!category) {
            return res.sendStatus(404);
          }

          if (!category.articles) {
            category.articles = [];
          }

          category.articles.push(req.body.article);

          category.save();
        }).catch(next);
    }

    // Remove article from category
    if (req.article.category && req.article.category.length) {
      Category.findOne({ slug: req.article.category })
        .then(category => {
          if (!category) {
            return res.sendStatus(404);
          }

          category.articles = category.articles.filter(article => article.slug !== req.body.article.slug);
          category.save();
        }).catch(next);
    }

    req.article.category = req.body.article.category;
  }

  req.article.save().then(article => res.json({ article })).catch(next);
});

module.exports = router;

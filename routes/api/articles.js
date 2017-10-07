var router = require('express').Router();
var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var Category = mongoose.model('Category');


// Preload article objects on routes with ':article'
router.param('article', function (req, res, next, slug) {
  Article.findOne({ slug: slug })
    .then(function (article) {
      if (!article) {
        return res.sendStatus(404);
      }

      req.article = article;

      return next();
    }).catch(next);
});


// Get articles
router.get('/', function (req, res, next) {
  var query = {};
  var limit = 20;

  if (typeof req.query.limit !== 'undefined') {
    limit = req.query.limit;
  }

  if (typeof req.query.query !== 'undefined') {
    return Article.where('title', new RegExp(req.query.query, 'i'))
      .then(function (articles) {
        if (!articles) {
          return res.sendStatus(404);
        }

        return res.json({
          articles: articles.map(function (article) {
            return article.toJSON();
          })
        });
      }).catch(next);
  }

  if (typeof req.query.random !== 'undefined') {
    return Article.count().exec(function (err, count) {
      var random = Math.floor(Math.random() * count);

      Article.findOne()
        .skip(random)
        .exec(function (err, article) {
          return res.json({
            article: article
          });
        });
    });
  }

  Promise.all([
    Article.find(query)
      .limit(Number(limit))
      .sort({ createdAt: 'desc' })
      .exec(),
    Article.count(query).exec()
  ]).then(function (results) {
    var articles = results[0];
    var articlesCount = results[1];

    return res.json({
      articles: articles.map(function (article) {
        return article.toJSON();
      }),
      articlesCount: articlesCount
    });
  }).catch(next);
});

// Get article
router.get('/:article', function (req, res, next) {
  return res.json({
    article: req.article.toJSON()
  });
});

// Create article
router.post('/', function (req, res, next) {
  var article = new Article(req.body.article);

  Category.findOne({ slug: req.body.article.category })
    .then(function (category) {
      if (!category) {
        return res.sendStatus(404);
      }

      if (!category.articles) {
        category.articles = [];
      }

      category.articles.push(article);

      category.save(function () {
        article.save()
          .then(function () {
            return res.json({
              article: article
            });
          }).catch(next);
      });
    }).catch(next);
});

// Update article
router.put('/:article', function (req, res, next) {
  if (typeof req.body.article.title !== 'undefined') {
    req.article.title = req.body.article.title;
  }

  if (typeof req.body.article.content !== 'undefined') {
    req.article.content = req.body.article.content;
  }

  if (typeof req.body.article.category !== 'undefined') {
    if (req.body.article.category.length) {
      Category.findOne({ slug: req.body.article.category })
        .then(function (category) {
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

    if (req.article.category && req.article.category.length) {
      Category.findOne({ slug: req.article.category })
        .then(function (category) {
          if (!category) {
            return res.sendStatus(404);
          }

          category.articles = category.articles.filter(function (article) {
            return article.slug !== req.body.article.slug
          });

          category.save();
        }).catch(next);
    }

    req.article.category = req.body.article.category;
  }

  req.article.save().then(function (article) {
    return res.json({
      article: article
    });
  }).catch(next);
});

module.exports = router;

var router = require('express').Router();
var mongoose = require('mongoose');
var Article = mongoose.model('Article');


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
  var random = 1;

  if (typeof req.query.limit !== 'undefined') {
    limit = req.query.limit;
  }

  // TODO: Add logic for search query

  // TODO: Add logic for random article
  if (typeof req.query.random !== 'undefined') {
    random = req.query.random;

    return Promise.all([
      Article.find(query)
        .limit(Number(random))
        .sort({ createdAt: 'desc' })
        .exec()
    ]).then(function (results) {
      var articles = results[0];

      return res.json({
        article: articles.map(function (article) {
          return article.toJSON();
        })[0]
      });
    }).catch(next);
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
  console.log(req.body.article);

  var article = new Article(req.body.article);

  article.save()
    .then(function () {
      return res.json({
        article: article
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

  req.article.save().then(function (article) {
    return res.json({
      article: article
    });
  }).catch(next);
});

module.exports = router;

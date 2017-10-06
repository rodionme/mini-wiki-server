var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');

var CategorySchema = new mongoose.Schema({
  slug: { type: String, lowercase: true, unique: true },
  title: String,
  articles: [{ type: mongoose.Schema.Types.Mixed, ref: 'Article' }]
});

CategorySchema.plugin(uniqueValidator, { message: 'is already taken' });

CategorySchema.pre('validate', function (next) {
  if (!this.slug) {
    this.slugify();
  }

  next();
});

CategorySchema.methods.slugify = function () {
  this.slug = slug(this.title) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
};

CategorySchema.methods.toJSON = function () {
  return {
    id: this._id,
    slug: this.slug,
    title: this.title,
    articles: this.articles.map(function (article) {
      return {
        id: article._id,
        slug: article.slug,
        title: article.title,
        content: article.content
      };
    }) || []
  };
};

mongoose.model('Category', CategorySchema);

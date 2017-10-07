let mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');
let slug = require('slug');

let CategorySchema = new mongoose.Schema({
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
    articles: this.articles.map(article => ({
      id: article._id,
      slug: article.slug,
      title: article.title,
      content: article.content
    })) || []
  };
};

mongoose.model('Category', CategorySchema);

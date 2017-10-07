let mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');
let slug = require('slug');

let ArticleSchema = new mongoose.Schema({
  slug: { type: String, lowercase: true, unique: true },
  title: String,
  content: String,
  category: { type: mongoose.Schema.Types.Stringlet, ref: 'Category' }
});

ArticleSchema.plugin(uniqueValidator, { message: 'is already taken' });

ArticleSchema.pre('validate', function (next) {
  if (!this.slug) {
    this.slugify();
  }

  next();
});

ArticleSchema.methods.slugify = function () {
  this.slug = slug(this.title) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
};

ArticleSchema.methods.toJSON = function () {
  return {
    id: this._id,
    slug: this.slug,
    title: this.title,
    content: this.content,
    category: this.category
  };
};

mongoose.model('Article', ArticleSchema);

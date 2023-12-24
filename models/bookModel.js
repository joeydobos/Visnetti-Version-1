const mongoose = require('mongoose');
const slugify = require('slugify');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  publicationYear: { type: Number },
  publisher: { type: String },
  isbn: { type: String },
  year: { type: Number },
  module: { type: String },
  slug: { type: String, unique: true }
});

// Before saving a new book, generate and set the slug
bookSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;

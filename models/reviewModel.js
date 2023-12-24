const mongoose = require('mongoose');
const Book = require('./bookModel');
const User = require('./userModel');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This refers to the 'users' collection
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book', // This refers to the 'books' collection
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

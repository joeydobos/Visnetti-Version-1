const Review = require('../models/reviewModel'); // Update the path
const Book = require('../models/bookModel'); // Update the path

// Function to get book ID from slug
const getBookIdFromSlug = async (slug) => {
  try {
    const book = await Book.findOne({ slug }); // Assuming you have a 'slug' field in your Book model
    if (!book) {
      throw new Error('Book not found');
    }
    return book._id; // Assuming the book's ObjectId is stored in _id
  } catch (error) {
    throw error;
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const userId = req.user._id; // Assuming the user's ObjectId is stored in _id
    const slug = req.params.slug; // Extract slug from route parameter

    const { rating, comment } = req.body;

    const bookId = await getBookIdFromSlug(slug);

    const newReview = new Review({
      user: userId,
      book: bookId,
      rating: rating,
      comment: comment
    });

    const savedReview = await newReview.save();

    res.status(201).json({
      status: 'success',
      data: {
        review: savedReview
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getUserReviews = async (req, res, next) => {
    try {
      const userId = req.user._id; // Using the authenticated user's ID
  
      const userReviews = await Review.find({ user: userId });
  
      res.status(200).json({
        status: 'success',
        data: {
          reviews: userReviews
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  };
  

exports.getBookReviews = async (req, res, next) => {
  try {
    const slug = req.params.slug;

    const book = await Book.findOne({ slug });
    if (!book) {
      return res.status(404).json({
        status: 'error',
        message: 'Book not found'
      });
    }

    const bookReviews = await Review.find({ book: book._id });

    res.status(200).json({
      status: 'success',
      data: {
        reviews: bookReviews
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

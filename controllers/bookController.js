const Book = require('../models/bookModel.js');
const catchAsync = require('./../utils/catchAsync');

// Get all books
exports.getAllBooks = catchAsync(async (req, res) => {
  const books = await Book.find();
  res.status(200).json({
    status: 'success',
    data: {
      books
    }
  });
});

// Get Book By ID
exports.getBookById = catchAsync(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return res.status(404).json({
      status: 'fail',
      message: 'Book not found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      book
    }
  });
});

exports.getBookBySlug = async (req, res, next) => {
  try {
    const slug = req.params.slug; // Extract slug from route parameter

    const book = await Book.findOne({ slug })
      .exec();

    res.status(200).json({
      status: 'success',
      data: {
        book: book
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while retrieving the book.'
    });
  }
};

// Create a new book
exports.createBook = catchAsync(async (req, res) => {
  const newBook = await Book.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      book: newBook
    }
  });
});

// Update a book
exports.updateBook = catchAsync(async (req, res) => {
  const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!updatedBook) {
    return res.status(404).json({
      status: 'fail',
      message: 'Book not found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      book: updatedBook
    }
  });
});

// Delete a book
exports.deleteBook = catchAsync(async (req, res) => {
  const deletedBook = await Book.findByIdAndDelete(req.params.id);

  if (!deletedBook) {
    return res.status(404).json({
      status: 'fail',
      message: 'Book not found'
    });
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

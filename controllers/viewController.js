const Book = require('../models/bookModel');
const Review = require('../models/reviewModel'); 

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Login'
  });
};

exports.getOverview = catchAsync(async (req, res, next) => {
  const { year, module } = req.query;
  const filter = {};
  if (year) {
    filter.year = year;
  }
  if (module) {
    filter.module = module;
  }
  const books = await Book.find(filter);
  let title = 'All Books';
  if (year && module) {
    title = `Books for Year ${year} - Module ${module}`;
  } else if (year) {
    title = `Books for Year ${year}`;
  } else if (module) {
    title = `Books for Module ${module}`;
  }
  res.status(200).render('overview', {
    title,
    books,
  });
});

exports.getBook = catchAsync(async (req, res, next) => {
  const slug = req.params.slug;

  const book = await Book.findOne({ slug });
  if (!book) {
    return res.status(404).json({
      status: 'error',
      message: 'Book not found'
    });
  }

  const bookReviews = await Review.find({ book: book._id });

  console.log(bookReviews)

  res.status(200).render('book', {
    book,
    reviews: bookReviews
  });
});

exports.year = catchAsync(async (req, res, next) => {

  res.status(200).render('year');
});



// viewController.js

exports.loadModules = catchAsync(async (req, res, next) => {
  const year = req.params.year;

  const yearModules = {
    year1: ['COMP116', 'COMP124', 'COMP108', 'COMP107', 'COMP109', 'COMP111', 'COMP122', 'COMP101', 'COMP105'],
    year2: ['COMP202', 'COMP207', 'COMP208', 'COMP201', 'COMP282', 'COMP219', 'COMP285', 'COMP226', 'COMP211', 'COMP218', 'COMP212', 'COMP221', 'COMP281', 'COMP222', 'COMP284', 'COMP220', 'COMP232', 'COMP229', 'COMP228'],
    year3: ['COMP390', 'COMP305', 'COMP335', 'COMP324', 'COMP326', 'COMP309', 'COMP313', 'ELEC319', 'COMP323', 'COMP304', 'COMP310', 'ELEC320', 'COMP318', 'COMP331', 'COMP329', 'COMP319', 'COMP343', 'COMP336', 'COMP338', 'COMP337', 'COMP328', 'COMP341', 'COMP342'],

  };

  if (!yearModules[year]) {
    return res.status(404).send('Not Found');
  }


  res.status(200).render('yearModules', { year, modules: yearModules[year] });
});


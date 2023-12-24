const express = require('express');
const bookController = require('../controllers/bookController');

const router = express.Router();

router.get('/', bookController.getAllBooks);
router.post('/', bookController.createBook);
router.get('/:slug', bookController.getBookBySlug); // Change the order here
router.get('/:id', bookController.getBookById);      // Keep this route below the slug route
router.patch('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

module.exports = router;

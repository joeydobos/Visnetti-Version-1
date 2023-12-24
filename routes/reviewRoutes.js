const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);


router.post('/createReview/:slug', reviewController.createReview);

router.get('/user/reviews', reviewController.getUserReviews);



router.get('/book/:slug/reviews', reviewController.getBookReviews);

module.exports = router;

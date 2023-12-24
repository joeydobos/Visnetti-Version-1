const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router
    .route('/')
    .get(userController.getAllUsers)

router
    .route('/:id')
    .get(userController.getUserById)

router.route('/forgotPassword').post(authController.forgotPassword)
router.route('/resetPassword/:token').patch(authController.resetPassword)

router.use(authController.protect);
router.delete('/deleteAccount', userController.deleteAccount);


module.exports = router;

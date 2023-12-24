const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController')

const router = express.Router();



// LOGIN 
router.get('/login',authController.isLoggedIn ,viewController.getLoginForm); // Use consistent naming
router.get('/',authController.isLoggedIn,viewController.getOverview)
router.get('/book/:slug', viewController.getBook);
router.get('/year', viewController.year);
router.get('/yearModules/:year', viewController.loadModules);



module.exports = router;


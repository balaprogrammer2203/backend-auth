const router = require("express").Router();
const authController = require('../../controllers/authController');
const { registerValidation } = require('./validations/registerValidation');
const { loginValidation } = require('./validations/loginValidation');
const { logoutValidation } = require('./validations/logoutValidation');


//REGISTER
router.route('/register').post(registerValidation, authController.registerUser);

//LOGIN
router.route('/login').post(loginValidation, authController.loginUser);

//REFRESH TOKEN
router.route('/refresh_token').post(authController.refreshToken);

//LOGOUT
router.route('/logout').post(logoutValidation, authController.logout);

module.exports = router;

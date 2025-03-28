const router = require("express").Router();
const authController = require('../../controllers/authController');
const { registerValidation } = require('./validations/auth/registerValidation');
const { loginValidation } = require('./validations/auth/loginValidation');
const { logoutValidation } = require('./validations/auth/logoutValidation');
const { refreshTokenValidation } = require('./validations/auth/refreshTokenValidation');


//REGISTER
router.route('/register').post(registerValidation, authController.registerUser);

//LOGIN
router.route('/login').post(loginValidation, authController.loginUser);

//REFRESH TOKEN
router.route('/refresh_token').post(refreshTokenValidation, authController.refreshToken);

//LOGOUT
router.route('/logout').post(logoutValidation, authController.logout);

//diff LOGIN
router.route('/diff_login').post(loginValidation, authController.diffLoginUser);

//diff REFRESH TOKEN
router.route('/diff_refresh_token').post(refreshTokenValidation, authController.diffRefreshToken);

//diff LOGOUT
router.route('/diff_logout').post(logoutValidation, authController.diffLogout);

module.exports = router;

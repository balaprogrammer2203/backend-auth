const router = require("express").Router();
const authController = require('../../controllers/authController');
const { registerValidation } = require('./validations/registerValidation');
const { loginValidation } = require('./validations/loginValidation');


//REGISTER
router.route('/register').post(registerValidation, authController.registerUser);

//LOGIN
router.route('/login').post(loginValidation, authController.loginUser);



module.exports = router;

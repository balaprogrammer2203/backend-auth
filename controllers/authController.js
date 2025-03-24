const User = require("../models/userModel");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const config = require('../config/config');
const response = require("../utils/response.js");
const customError = require("../utils/customError.js");

//Register User - /api/v1/auth/register
exports.registerUser = async (req, res, next) => {

    // console.log("req.body", req.body);
    // console.log("username", req.body.username);
    // console.log("email", req.body.email);
    // console.log("password", req.body.password);
    try {

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        config.password.secret
      ).toString(),
    });

    // console.log("newUser", newUser);

      const savedUser = await newUser.save();
      response(res, 201, true, 'User successfully registered', savedUser);
    } catch (err) {
      // response(res, 500, false, 'Internal Sever Error', err.message);
      next(err);
    }
  };

//Login User - /api/v1/auth/login
exports.loginUser = async (req, res, next) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if(!user){
        let errors = [{
          message: 'Username does not exists',
          field: 'username'
        }];
        return next(customError(401, "Unauthorized Error", { errors }));
      }
      // !user && res.status(res, 401, false, "Username doesnt Exist");
      //return next(customError(401, "Validation Error", { errors: errors.array() }));

      const hashedPassword = CryptoJS.AES.decrypt(
        user.password,
        config.password.secret
      );
      const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

      if(originalPassword !== req.body.password){
        let errors = [{
          message: 'Invalid Password',
          field: 'password'
        }];
        return next(customError(401, "Unauthorized Error", { errors }));
      }

      // originalPassword !== req.body.password &&
      //   response(res, 401, false, 'Wrong Password');

      const accessToken = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
        },
        config.jwt.secret,
        { expiresIn: "24h" }
      );

      const { password, ...others } = user._doc;

      response(res, 200, true, "Login successful", {accessToken, ...others});
    } catch (err) {
      //response(res, 500, false, 'Internal Sever Error', err.message);
      next(err);
    }
}
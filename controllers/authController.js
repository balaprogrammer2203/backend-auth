const User = require("../models/userModel");
const CryptoJS = require("crypto-js");
// const jwt = require("jsonwebtoken");
const redis = require("../db/redis");

// helpers
const authHelper = require('../helpers/authHelper');

const config = require('../config/config');
const response = require("../utils/response.js");
const customError = require("../utils/customError.js");

//Register User - /api/v1/auth/register
exports.registerUser = async (req, res, next) => {
  // console.log("req.body", req.body);
  const { username, email, password } = req.body;

  console.log("username", username);
  console.log("email", email);
  console.log("password", password);
    try {

    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      let errors = [{
        message: 'Email already exists! Please try different',
        field: 'email'
      }];
      return next(customError(409, "Conflict Error", { errors }));
    }

    const checkUsername = await User.findOne({ username });
    if (checkUsername) {
      let errors = [{
        message: 'Username already exists! Please try different',
        field: 'username'
      }];
      return next(customError(409, "Conflict Error", { errors }));
    }
  
    const newUser = new User({
      username: username,
      email: email,
      password: CryptoJS.AES.encrypt(
        password,
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
        return next(customError(409, "Conflict Error", { errors }));
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
          message: 'Incorrect Password! Please try again',
          field: 'password'
        }];
        return next(customError(401, "Unauthorized Error", { errors }));
      }

      // originalPassword !== req.body.password &&
      //   response(res, 401, false, 'Wrong Password');

      // const accessToken = jwt.sign(
      //   {
      //     id: user._id,
      //     isAdmin: user.isAdmin,
      //   },
      //   config.jwt.secret,
      //   { expiresIn: "60m" }
      // );

      const accessToken = await authHelper.signAccessToken({
        id: user._id,
        isAdmin: user.isAdmin,
        // role: user.role,
      });

      const refreshToken = await authHelper.signRefreshToken(user._id);

      // const { password, ...others } = user._doc;
      const userData = user._doc;
      delete userData.password;
      delete userData.updatedAt;
      delete userData.__v;

      // response(res, 200, true, "Login successful", {accessToken, ...others});
      response(res, 200, true, "Login successful", {accessToken, refreshToken, user: userData});
    } catch (err) {
      //response(res, 500, false, 'Internal Sever Error', err.message);
      next(err);
    }
}

//User refreshToken - /api/v1/auth/refresh_token
exports.refreshToken = async (req, res, next) => {
	const { refresh_token } = req.body;

	try {
		if (!refresh_token) {
      let errors = [{
        message: 'Refresh token not exists'
      }];
      return next(customError(401, "Validation Error", { errors }));
			// throw Boom.badRequest();
		}

		const user_id = await authHelper.verifyRefreshToken(refresh_token);	
		const refreshToken = await authHelper.signRefreshToken(user_id);

    const user = await User.findOne({ _id: user_id });
    // console.log('user id record', user);
      if(!user){
        let errors = [{
          message: 'User ID does not exists',
          field: '_id'
        }];
        return next(customError(401, "Validation Error", { errors }));
      }

      const accessToken = await authHelper.signAccessToken({ 
        id: user_id,
        isAdmin: user.isAdmin,
      });

		// res.json({ accessToken, refreshToken });
    response(res, 200, true, "Refresh token successful", { accessToken, refreshToken });
	} catch (err) {
		next(err);
	}
};

//User logout - /api/v1/auth/logout
exports.logout = async (req, res, next) => {
	try {
		const { refresh_token } = req.body;
		if (!refresh_token) {
      let errors = [{
        message: 'Refresh token not exists'
      }];
      return next(customError(400, "Bad request", { errors }));
			// throw Boom.badRequest();
		}

		const user_id = await authHelper.verifyRefreshToken(refresh_token);
		const data = await redis.del(user_id);
    console.log('after del redis -- data', data)
		if (!data) {
      let errors = [{
        message: 'Redis user token not exists'
      }];
      return next(customError(400, "Bad request", { errors }));
			// throw Boom.badRequest();
		}

		// res.json({ message: "success" });
    response(res, 200, true, "Logged out successfully!");
	} catch (err) {		
		return next(err);
	}
};
const User = require("../models/userModel");
const UserToken = require("../models/diffUserToken.js");

const CryptoJS = require("crypto-js");
const redis = require("../db/redis");

// helpers
const authHelper = require('../helpers/authHelper');
const diffTokenHelper = require('../helpers/diffTokenHelper');

const config = require('../config/config');
const response = require("../utils/response.js");
const customError = require("../utils/customError.js");

//Register User - /api/v1/auth/register
exports.registerUser = async (req, res, next) => {
  // console.log("req.body", req.body);
  const { username, email, password } = req.body;

  // console.log("username", username);
  // console.log("email", email);
  // console.log("password", password);
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
        return next(customError(401, "Validation Error", { errors }));
      }

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

      const accessToken = await authHelper.signAccessToken({
        id: user._id,
        isAdmin: user.isAdmin,
        // role: user.role,
      });

      const refreshToken = await authHelper.signRefreshToken(user._id);
      
      const userData = user._doc;
      delete userData.password;
      delete userData.updatedAt;
      delete userData.__v;
      
      response(res, 200, true, "Login successful", {accessToken, refreshToken, user: userData});
    } catch (err) {
      
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

    response(res, 200, true, "Refresh token created successfully", { accessToken, refreshToken });
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
      return next(customError(401, "Validation Error", { errors }));
		}

		const user_id = await authHelper.verifyRefreshToken(refresh_token);
		const data = await redis.del(user_id);
    console.log('after del redis -- data', data)
		if (!data) {
      let errors = [{
        message: 'Redis user token not exists'
      }];
      return next(customError(401, "Validation Error", { errors }));
		}
		
    response(res, 200, true, "Logged out successfully!");
	} catch (err) {		
		return next(err);
	}
};

//diff Login User - /api/v1/auth/diff_login
exports.diffLoginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if(!user){
      let errors = [{
        message: 'Username does not exists',
        field: 'username'
      }];
      return next(customError(401, "Validation Error", { errors }));
    }

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

    const accessToken = await diffTokenHelper.diffSignAccessToken({
      id: user._id,
      isAdmin: user.isAdmin,
      // role: user.role,
    });

    const refreshToken = await diffTokenHelper.diffSignRefreshToken(user._id);
    
    const userData = user._doc;
    delete userData.password;
    delete userData.updatedAt;
    delete userData.__v;
    
    response(res, 200, true, "Login successful", {accessToken, refreshToken, user: userData});
  } catch (err) {
    
    next(err);
  }
}


//diff User refreshToken - /api/v1/auth/diff_refresh_token
exports.diffRefreshToken = async (req, res, next) => {
	const { refresh_token } = req.body;

	try {
		if (!refresh_token) {
      let errors = [{
        message: 'Refresh token not exists'
      }];
      return next(customError(401, "Validation Error", { errors }));
		}

		const user_id = await diffTokenHelper.diffVerifyRefreshToken(refresh_token);	
		const newRefreshToken = await diffTokenHelper.diffSignRefreshToken(user_id);

    const user = await User.findOne({ _id: user_id });
    // console.log('user id record', user);
      if(!user){
        let errors = [{
          message: 'User ID does not exists',
          field: '_id'
        }];
        return next(customError(401, "Validation Error", { errors }));
      }

      const newAccessToken = await diffTokenHelper.diffSignAccessToken({ 
        id: user_id,
        isAdmin: user.isAdmin,
      });

    response(res, 200, true, "Refresh token created successfully", { accessToken : newAccessToken, refreshToken : newRefreshToken });
	} catch (err) {
		next(err);
	}
};

//diff User logout - /api/v1/auth/diff_logout
exports.diffLogout = async (req, res, next) => {
	try {
		const { refresh_token } = req.body;
		if (!refresh_token) {
      let errors = [{
        message: 'Refresh token not exists'
      }];
      return next(customError(401, "Validation Error", { errors }));
		}

    const userToken = await UserToken.findOne({ refreshToken: refresh_token });
    console.log('userToken', userToken);
    if (!userToken) { 
      // if token not in db, already may be logout. so success
      response(res, 200, true, "Logged out successfully!");
    }      
    // if token is exist, then delete that token
    const user_id = await diffTokenHelper.diffVerifyRefreshToken(refresh_token);
    await userToken.deleteOne({ userId: user_id });

		// const user_id = await diffTokenHelper.diffVerifyRefreshToken(refresh_token);
		// const data = await redis.del(user_id);
    // console.log('after del redis -- data', data)
		// if (!data) {
    //   let errors = [{
    //     message: 'Redis user token not exists'
    //   }];
    //   return next(customError(401, "Validation Error", { errors }));
		// }
		
    response(res, 200, true, "Logged out successfully!");
	} catch (err) {		
		return next(err);
	}
};
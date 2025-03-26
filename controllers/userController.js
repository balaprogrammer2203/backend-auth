const User = require("../models/userModel");

const config = require('../config/config');
const customError = require("../utils/customError.js");
const response = require("../utils/response.js");

//Get All User - /api/v1/users/
exports.getAllUser = async (req, res, next) => {
    //console.log("req", req.query.new);
    const query = req.query.new
    try {
        const users= query ? await User.find().sort({ _id: -1}).limit(5) : await User.find().select("-password -updatedAt -__v");
        response(res, 200, true, "Successfully fetched all users", users);
    } catch (err) {
        //response(res, 500, false, "Internal server error", err.message);
        next(err);
    }
}

//Get User - /api/v1/users/find/:id
exports.getUser = async (req, res, next) => {
    console.log("req.params", req.params);
    try {
        const user = await User.findById(req.params.id).select("-password -updatedAt")
        if(!user){
            let errors = [{
                message: `No user with id : ${req.params.id}`,
            }];
            return next(customError(404, "Not Found Error", { errors }));
        }
        // const { password, ...userdetail} = user._doc;
        const userdetail = user._doc;

        response(res, 200, true, "Successfully fetched user", userdetail);
    } catch (err) {
        //response(res, 500, false, "Internal server error", err.message);
        next(err);
    }
}

//UPDATE User - /api/v1/users/:id
exports.updateUser = async (req, res, next) => {
    console.log("req.body", req.body);

    // if(req.body.password) {
    //     req.body.password = CryptoJS.AES.encrypt(
    //         req.body.password, config.password.secret
    //     ).toString();
    // }

    try {
        const user = await User.findById(req.params.id)
        if(!user){
            let errors = [{
                message: `No user with id : ${req.params.id}`,
            }];
            return next(customError(404, "Not Found Error", { errors }));
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id,
            {
                $set: req.body
            },
            {new: true}
        );

        response(res, 200, true, "User successfully updated", updatedUser);

    } catch (err) {
        //response(res, 500, false, "Internal server error", err.message);
        next(err);
    }
}

//DELETE User - /api/v1/users/:id
exports.deleteUser = async (req, res, next) => {

    console.log("req.params", req.params);
    try {
        const user = await User.findById(req.params.id)
        if(!user){
            let errors = [{
                message: `No user with id : ${req.params.id}`,
            }];
            return next(customError(404, "Not Found Error", { errors }));
        }

        await User.findByIdAndDelete(req.params.id)

        response(res, 200, true, "User deleted successfully", null);
    } catch (err) {
        //response(res, 500, false, "Internal server error", err.message);
        next(err);
    }

}

//GET USER STATS - /api/v1/users/stats
exports.statsUser = async (req, res, next) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() -1));

    try {

        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },

            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                }
            }
        ]);

      response(res, 200, true, "Successfully fetched user stats", data);
    } catch (err) {
      //response(res, 500, false, "Internal server error", err.message);
      next(err);
    }
}
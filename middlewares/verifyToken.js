const jwt = require("jsonwebtoken");
const response = require("../utils/response.js");
const config = require('../config/config');

//UPDATE USER INFORMATION
const verifyToken = (req, res, next) => {
    //console.log("req.headers", req.headers)

    const authHeader = req.headers.authorization
    console.log("authHeader..", authHeader)

    if(authHeader) {
        const token = authHeader.split(" ")[1];
         //console.log("token", token)

        jwt.verify(token, config.jwt.secret, (err, user) => {
            if(err) res.status(403).json("Invalid Token!");
            req.user = user;
            //console.log("verifyToken req.user", user)

            next();
        })
    } else{
        return response(res, 401, false, "Auth header token missed");
    }
};


const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req,res,()=>{

        // console.log("req.params.id --middleware", req.params.id)
        // console.log("req.user.isAdmin --middleware", req.user.isAdmin)

        if(req.user.id === req.params.id || req.user.isAdmin) {
            next();
        }else{
            response(res, 403, false, "You are not allowed to do this");
        }
    });
};


const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req,res,()=>{
        // console.log("req.user --middleware", req.user)
        // console.log("req.user.isAdmin --middleware", req.user.isAdmin)
        if(req.user.isAdmin) {
            next();
        } else{
            response(res, 403, false, "You are not allowed to do this");
        }
    });
};

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };

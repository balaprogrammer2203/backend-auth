const JWT = require("jsonwebtoken");
const redis = require("../db/redis");

const config = require('../config/config');
const customError = require("../utils/customError.js");
const response = require("../utils/response.js");

const signAccessToken = (data) => {
	return new Promise((resolve, reject) => {
		const payload = {
			...data,
		};

		const options = {
			// expiresIn: "2d",
            // expiresIn: "24h",
            expiresIn: "60m"
			// issuer: "ecommerce.app",
		};

		JWT.sign(payload, config.jwt.secret, options, (err, token) => {
			if (err) {
				console.log(err);
				reject(err); // err handle -- to check
			}

			resolve(token);
		});
	});
};

const verifyAccessToken = (req, res, next) => {
    //console.log("req.headers", req.headers)

    const authHeader = req.headers["authorization"];
    console.log("authHeader..", authHeader)

    if(authHeader) {
        const token = authHeader.split(" ")[1];
         //console.log("token", token)

        JWT.verify(token, config.jwt.secret, (err, user) => {
            if(err) {
                // res.status(403).json("Invalid access token!");
                let errors = [{
                    message: 'Invalid access token!'
                }];
                return next(customError(403, "JsonWebTokenError", { errors }));
            }
            req.user = user;
            console.log("verifyAccessToken req.user", user)

            next();
        })
    } else{
        return response(res, 401, false, "Auth header token missed");
    }
};

const signRefreshToken = (user_id) => {
	return new Promise((resolve, reject) => {
		const payload = {
			user_id,
		};
		const options = {
			expiresIn: "180d",
			// issuer: "ecommerce.app",
		};

		JWT.sign(payload, config.jwt.refresh_secret, options, (err, refreshToken) => {
			if (err) {
				console.log(err);
				reject(err); // err handle -- to check
			}

            //redis
			redis.set(user_id, refreshToken, "EX", 180 * 24 * 60 * 60);

			resolve(refreshToken);
		});
	});
};

const verifyRefreshToken = async (refresh_token) => {
	return new Promise(async (resolve, reject) => {
		JWT.verify(
			refresh_token,
			config.jwt.refresh_secret,
			async (err, payload) => {
				if (err) {
					return reject(err); // err handle -- to check
				}

				const { user_id } = payload;

                // redis check
				const stored_refresh_token = await redis.get(user_id);
				if (!stored_refresh_token) {
					return reject('Invalid refresh token'); // err handle -- to check
				}

				if (refresh_token === stored_refresh_token) {
					return resolve(user_id);
				}
			}
		);
	});
};

module.exports = {
	signAccessToken,
	verifyAccessToken,
	signRefreshToken,
	verifyRefreshToken,
};
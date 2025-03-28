const JWT = require("jsonwebtoken");
// const redis = require("../db/redis");

const config = require('../config/config.js');
const customError = require("../utils/customError.js");
const response = require("../utils/response.js");

const UserToken = require("../models/diffUserToken.js");

const diffSignAccessToken = (data) => {
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

const diffVerifyAccessToken = (req, res, next) => {
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


const diffSignRefreshToken = async (user_id) => {
	return new Promise( async (resolve, reject) => {
		const payload = {
			user_id,
		};
		const options = {
			expiresIn: "30d",
			// issuer: "ecommerce.app",
		};

		JWT.sign(
            payload, 
            config.jwt.refresh_secret, 
            options, 
            async (err, refreshToken) => {
			if (err) {
				console.log(err);
				reject(err); // err handle -- to check
			}

			// redis.set(user_id, refreshToken, "EX", 30 * 24 * 60 * 60);

            const userToken = await UserToken.findOne({ userId: user_id });
            console.log('userToken - diffSignRefreshToken', userToken);
            if (userToken) await userToken.deleteOne({ userId: user_id });
            await new UserToken({ userId: user_id, refreshToken: refreshToken }).save();

			resolve(refreshToken);
		});
	});
};

const diffVerifyRefreshToken = async (refresh_token) => {
	return new Promise(async (resolve, reject) => {
        const userToken = await UserToken.findOne({ refreshToken: refresh_token });
            console.log('userToken - diffVerifyRefreshToken', userToken);
            if (!userToken)
                return reject("refresh token not exist in db");

            JWT.verify(
                refresh_token,
                config.jwt.refresh_secret,
                async (err, payload) => {
                    if (err) {
                        console.log(err);
                        return reject(err); // err handle -- to check
                    }

                    const { user_id } = payload;

                    // redis check
                    // const stored_refresh_token = await redis.get(user_id);
                    // if (!stored_refresh_token) {
                    // 	return reject('Invalid refresh token'); // err handle -- to check
                    // }

                    // if (refresh_token === stored_refresh_token) {
                    // 	return resolve(user_id);
                    // }

                    return resolve(user_id);
                }
            );
    });
};

// just for ref-- src sample code
const refGenerateTokens = async (user) => {
    try {
        const payload = { _id: user._id, roles: user.roles };
        const accessToken = JWT.sign(
            payload,
            config.jwt.secret,
            { expiresIn: "1h" }
        );
        const refreshToken = JWT.sign(
            payload,
            config.jwt.refresh_secret,
            { expiresIn: "30d" }
        );

        const userToken = await UserToken.findOne({ userId: user._id });
        if (userToken) await userToken.remove();

        await new UserToken({ userId: user._id, token: refreshToken }).save();
        return Promise.resolve({ accessToken, refreshToken });
    } catch (err) {
        return Promise.reject(err);
    }
};

// just for ref-- src sample code
const refVerifyRefreshToken = (refreshToken) => {

    return new Promise((resolve, reject) => {
        UserToken.findOne({ token: refreshToken }, (err, doc) => {
            if (!doc)
                return reject({ error: true, message: "Invalid refresh token" });

            JWT.verify(refreshToken, config.jwt.refresh_secret, (err, tokenDetails) => {
                if (err)
                    return reject({ error: true, message: "Invalid refresh token" });
                resolve({
                    tokenDetails,
                    error: false,
                    message: "Valid refresh token",
                });
            });
        });
    });
};

module.exports = {
	refGenerateTokens,
	refVerifyRefreshToken,
    diffSignAccessToken,
    diffVerifyAccessToken,
    diffSignRefreshToken,
    diffVerifyRefreshToken
};

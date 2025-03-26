const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.PORT || 5000,
    mongoose: {
        url: process.env.MONGODB_URL,
        options: {
        
        },
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        refresh_secret: process.env.JWT_REFRESH_SECRET,
    },
    password: {
        secret: process.env.PASSWORD_SECRET,
    }
};


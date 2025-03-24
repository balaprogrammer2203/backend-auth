const express = require('express');
const router = express.Router();
const config = require('../../config/config');

const authRoute = require('./auth');
const userRoute = require('./users');

const defaultRoutes = [
  { path: '/auth', route: authRoute },
  { path: '/users', route: userRoute },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});


 // routes available only in development mode
const devRoutes = [
    // {
    //   path: '/docs',
    //   route: docsRoute,
    // },
  ];

/* istanbul ignore next */
if (config.env === 'development') {
    if(devRoutes.length){
        devRoutes.forEach((route) => {
            router.use(route.path, route.route);
        });
    }
}

module.exports = router;


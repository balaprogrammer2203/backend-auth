const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../../middlewares/verifyToken");
const { verifyAccessToken } = require('../../helpers/authHelper');
const router = require("express").Router();
const userController = require('../../controllers/userController');
const { updateUserValidation } = require('./validations/updateUserValidation');

//GET ALL USERS
// router.route('/').get(verifyToken, userController.getAllUser);
router.route('/').get(verifyAccessToken, userController.getAllUser);

//GET USER
// router.route('/find/:id').get(verifyToken, userController.getUser);
router.route('/find/:id').get(verifyAccessToken, userController.getUser);

//UPDATE USER
router.route('/:id').put(verifyTokenAndAuthorization, updateUserValidation, userController.updateUser);

//DELETE
router.route('/:id').delete(verifyTokenAndAdmin, userController.deleteUser);

//GET USER STATS
router.route('/stats').get(verifyTokenAndAdmin, userController.statsUser);


module.exports = router;

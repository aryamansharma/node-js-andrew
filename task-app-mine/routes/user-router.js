const express = require('express');
const router = new express.Router();
const userController = require('../controllers/user-controller');
const auth = require('../middleware/auth');

router.route('/signUp').post(userController.signUpUser);
router.route('/login').post(userController.loginUser);

router.use(auth);

router.route('/logout').post(userController.logout);
router.route('/logoutAll').post(userController.logoutAll);
router.route('/me').get(userController.getProfile);
router.route('/:id').get(userController.getUser).delete(userController.deleteUser).patch(userController.updateUser);

module.exports = router;
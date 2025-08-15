const express = require('express');
const router = new express.Router();
const userController = require('../controllers/user-controller');
const auth = require('../middleware/auth');

// this multer is the package we use for file uploads, express by default dont provide any support for file uploads
// basically it takes a file(pdf,word, png, jpg.. etc.) and convert them into a binary form which we can store in our db. 
const multer = require('multer');

// this object will used for configuration of the file upload
const upload = multer({
    // if we add this dest porperty in this object then the binary data image will not be present in the callback method used by the route handler.
    // but if we remove this property then the binary of the image will be present in the callback method used by the route handler.
    // dest: 'avatars', // this is the destination directory(folder) name where we want to store file uploads
    limits: {
        fileSize: 1000000 // this is for setting the file size limit. current value which we are using is 1MB. this filSize accepts size in bits
    },
    fileFilter(req, file, cb) { // this method is used for checking the extension of the file
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) { // here we are checking just for jpg, jpeg or png extensions
            // this cb is the callback, basically the 3rd paramter of the fileFilter method and this is we use cb to throw an error if 
            // we dont want to accept this extension we uploaded
            return cb(new Error('please upload jpg, jpeg or png'));
        }

        // this is we accept the extension we uploaded
        cb(undefined, true);
    }
});

router.route('/signUp').post(userController.signUpUser);
router.route('/login').post(userController.loginUser);

router.route('/:id/avatar').get(userController.getAvatar);

router.use(auth);
// when we sending data in a req, we were using json format, eg when we were sending data creating a user we were sending email, password etc. in the 
// json format to the server, but in case of file uploads we send data in the form of 'form-data'.

// we use this 'single' method from multer as a middleware and the paramter of this single method will be the value key which will contain the file
// form the 'form-data'
router.route('/me/avatar')
    .post(upload.single('avatar'), userController.fileUpload, userController.fileUploadErrorHandler)
    .delete(upload.single('avatar'), userController.deleteAvatar, userController.fileUploadErrorHandler);

router.route('/logout').post(userController.logout);

router.route('/logoutAll').post(userController.logoutAll);

router.route('/me')
    .get(userController.getProfile)
    .delete(userController.deleteUser)
    .patch(userController.updateUser);

module.exports = router;
const express = require('express');

const router = express.Router();

const TrendifyControllers = require('../controllers/TrendifyController.js');
const AdminControllers = require('../controllers/AdminController.js');

//user side routes
router.get('/login', TrendifyControllers.loginController);
router.post('/register_user', TrendifyControllers.registerUserController);
router.post('/user_verification', TrendifyControllers.userVerificationController);
router.get('/forgotpassword', TrendifyControllers.forgotpasswordController);
router.post('/updatepassword', TrendifyControllers.updatepasswordController);
router.get('/passwordreset', TrendifyControllers.passwordresetController);
router.post('/sendemail', TrendifyControllers.sendemailController);
router.get('/logout', TrendifyControllers.logoutController);
router.get('/profile', TrendifyControllers.profileController);
router.post('/profileupdate', TrendifyControllers.profileUpdateController);

router.get('/home', TrendifyControllers.homeController);
router.get('/contactus', TrendifyControllers.contactusController);
router.get('/aboutus', TrendifyControllers.aboutusController);



//Admin side routes
router.get('/Trendify_AdminLogin', AdminControllers.adminLoginController);
router.post('/admin_register_user', AdminControllers.registerAdminController);
router.get('/createPassword', AdminControllers.createPasswordController);
router.post('/adminupdatepassword', AdminControllers.adminUpdatePasswordController);
router.post('/admin_verification', AdminControllers.adminVerificationController);



module.exports = router


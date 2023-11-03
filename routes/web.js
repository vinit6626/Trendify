const express = require('express');

const router = express.Router();
const multer = require('multer'); 
const storage = multer.diskStorage ({
    destination: function (req, file, cb) {
        return cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`)
    },
});
const upload = multer({ storage });

const TrendifyControllers = require('../controllers/TrendifyController.js');
const AdminControllers = require('../controllers/AdminController.js');
const BrandControllers = require('../controllers/BrandController.js');
const CategoryControllers = require('../controllers/CategoryController.js');
const ProductControllers = require('../controllers/ProductController.js');
const UserControllers = require('../controllers/UserController.js');
const UserProductControllers = require('../controllers/UserProductController.js');




//Guest and user login routes
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


//Brand Routes
router.get("/brand", BrandControllers.brandController);
router.post('/addbrand', BrandControllers.addBrandController);
router.get("/managebrand", BrandControllers.manageBrandController);
router.get('/deletebrand/:id', BrandControllers.deleteBrandController);
router.get('/editbrand/:id', BrandControllers.editBrandController);
router.post('/updatebrand', BrandControllers.updateBrandController);



//Category Routes

router.get("/category", CategoryControllers.categoryController);
router.post('/addcategory', CategoryControllers.addCategoryController);
router.get("/managecategory", CategoryControllers.manageCategoryController);
router.get('/deletecategory/:id', CategoryControllers.deleteCategoryController);
router.get('/editcategory/:id', CategoryControllers.editCategoryController);
router.post('/updatecategory', CategoryControllers.updateCategoryController);

//Product Routes

router.get("/product", ProductControllers.productController);
router.post('/addproduct', upload.single('productImage'), ProductControllers.addProductController);
router.get("/manageproduct", ProductControllers.manageProductController);
router.get('/deleteproduct/:id', ProductControllers.deleteProductController);
router.get('/editproduct/:id', ProductControllers.editProductController);
router.post('/updateproduct', upload.single('productImage'), ProductControllers.updateProductController);
router.post('/searchProduct', ProductControllers.searchProductController);


//Manage User
router.get("/manageuser", UserControllers.manageUserController);
router.get("/blockuser/:id", UserControllers.blockUserController);
router.get("/active/:id", UserControllers.activeUserController);
router.get("/edituser/:id", UserControllers.editUserController);
router.post('/updateuserinfo', UserControllers.updateUserInfoController);

// Products for user
router.get('/userproducts', UserProductControllers.userProductController);
router.get("/viewproduct/:id", UserProductControllers.viewProductController);
router.get("/productdetails", UserProductControllers.productDetailsController);



module.exports = router


const productsDataModel = require('../models/productdb.js');
const brandDataModel = require('../models/branddb.js');
const categoryDataModel = require('../models/categorydb.js');

const nodemailer = require('nodemailer');


class UserProductControllers {

    static userProductController = async (req, res) => {

        const email = req.session.fname === "default" ? req.session.email : req.session.fname;

        // if (req.session.email && req.session.userType) {

            const productsData = await productsDataModel.find({product_visibility: 'visible'});
            const brandData = await brandDataModel.find({});
            const categoryData = await categoryDataModel.find({});
            res.render('userproduct/products.ejs', {msg: "", email, type: req.session.userType, productsData, brandData, categoryData});
            // }else{
            //     res.render("login.ejs", { msg: "Please login to access our service.", email, type: req.session.userType});
            // }
    }

    static viewProductController = async (req, res) => {
        req.session.product_id = req.params.id;
        res.redirect("/productdetails");
    }
    static productDetailsController = async (req, res) => {

    const email = req.session.fname === "default" ? req.session.email : req.session.fname;

        const product = await productsDataModel.findById(req.session.product_id);
        console.log(product);
        const brandData = await brandDataModel.find({});
        const categoryData = await categoryDataModel.find({});
        res.render("userproduct/viewproduct.ejs", { msg: "", email, type: req.session.userType, product, brandData, categoryData });
    }
}

module.exports = UserProductControllers

const userDataModel = require('../models/userdb.js');
const nodemailer = require('nodemailer');


class UserControllers {

    static manageUserController = async (req, res) => {
        const email = req.session.fname === "default" ? req.session.email : req.session.fname;
        if (req.session.email && req.session.userType) {

        const userData = await userDataModel.find({userType: 'user'});
        console.log(`User ${userData}`);

        res.render('user/manageuser.ejs', {msg: "", email, type: req.session.userType, userData});
        }else{
            res.render("login.ejs", { msg: "Please login to access our service.", email, type: req.session.userType});
        }
    }

    static blockUserController = async (req, res) => {
        const id = req.params.id;
    
        try {
            const userData = await userDataModel.findByIdAndUpdate(id, { status: 'deactive' });
    
            if (!userData) {
                console.error('User details not updated.');
            } else {
                console.log('Successfully updated user');
            }
            res.redirect("/manageuser");

        } catch (error) {
            res.redirect("/manageuser");
        }
    }

    static activeUserController = async (req, res) => {
        const id = req.params.id;
    
        try {
            const userData = await userDataModel.findByIdAndUpdate(id, { status: 'active' });
    
            if (!userData) {
                console.error('User details not updated.');
            } else {
                console.log('Successfully updated user');
            }
            res.redirect("/manageuser");

        } catch (error) {
            res.redirect("/manageuser");
        }
    }

    static editUserController = async (req, res) => {
        const id = req.params.id;
        const email = req.session.fname === "default" ? req.session.email : req.session.fname;
        if (req.session.email && req.session.userType) {
            try {
                const userData = await userDataModel.findById(id);
                if (!userData) {
                    console.error('User details not updated.');
                } else {
                    console.log('Successfully updated user');
                }
                res.render('user/edituser.ejs', {msg: "", email, type: req.session.userType, userData});
            } catch (error) {
                res.redirect("/manageuser");
            }
        }else{
            res.render("login.ejs", { msg: "Please login to access our service.", email, type: req.session.userType});
        }
    }

    static updateUserInfoController = async (req, res) => {
        const id = req.body.id;
        const userData = await userDataModel.findByIdAndUpdate(id, { 
            fname: req.body.fname,
            lname: req.body.lname,
            address: req.body.address,
            zipcode: req.body.zipcode,
            contactno: req.body.contactno
        });
        if (!userData) {
            console.error('User details not updated.');
        } else {
            console.log('Successfully updated user');
        }
        res.redirect("/manageuser");
        
    }

}
module.exports = UserControllers

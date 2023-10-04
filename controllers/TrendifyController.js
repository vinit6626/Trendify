const userDataModel = require('../models/userdb.js');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
function generateRandomCode() {
    return Math.floor(100000 + Math.random() * 900000);
}
class TrendifyController {
    static loginController = async (req, res) => {
        res.render('login.ejs', {msg: ""});
    }
    static registerUserController = async (req, res) => {
        try {
            const form_data = req.body;
            const hashPassword = await bcrypt.hash(form_data.password, 10);

            const userData_inserted = await userDataModel.create({
                email: form_data.email,
                password: hashPassword,
                userType: "user"
            });

            console.log("*** data added successfully to DB ***");
            console.log(userData_inserted);
            res.render("login.ejs", { msg: "Sign up Successful👍"});
        } catch (error) {
            console.log("--- Sorry data is not added to DB due to error Below -----");
            console.error(error);
            res.render("login.ejs", { msg: 'Please, sign up with a different email'});
        }
    }
    
    static userVerificationController = async (req, res) => {
        const { email, password } = req.body;
        const confirm_user_in_db = await userDataModel.findOne({ email: email })
        if (!confirm_user_in_db) {
            console.log("hello");
            res.render("login.ejs", { msg: "😢 User Not Found, Please Enter Valid Email" });
        } else {
            const isMatch = await bcrypt.compare(password, confirm_user_in_db.password);
            if (isMatch) {
                req.session.userEmail = confirm_user_in_db.email;
                email: confirm_user_in_db.email;
                const type = confirm_user_in_db.userType;
                req.session.email = email;
                req.session.userType = type;
                console.log(req.session.userEmail);
                res.redirect("/home");
                // res.render("home.ejs", {email, type});

            } else {
                res.render("login.ejs", { msg: "Incorrect Password 😔, Please Enter Valid Password" });

            }
        }
    }

    static profileController = async (req, res) => {
        const email = req.session.email || ""; 
        const type = req.session.userType || "";
        let userData = {
          email: '',
          fname: '',
          lname: '',
          address: '',
          zipcode: '',
          contactno: ''
        };
      
        if(req.session.email && req.session.userType){
          try {
            // Assuming you have a userDataModel that represents your MongoDB model
            const user = await userDataModel.findOne({ email: email });
      
            // If a user with the provided email exists, use their data
            if (user) {
              userData = user.toObject();
            }
          } catch (error) {
            console.error('Error retrieving user data:', error);
          }
        }
      
        res.render('profile.ejs', { msg: '', email, type, userData });
      };
      
    
      static profileUpdateController = async (req, res) => {
        const email = req.session.email || ""; 
        const type = req.session.userType || "";
        const updatedUserDetails = req.body;
      
        if (req.session.email && req.session.userType) {
          try {
            const updateDocument = {
              $set: updatedUserDetails 
            };
      
            const result = await userDataModel.findOneAndUpdate({ email: email }, updateDocument, {
              returnOriginal: false 
            });
      
            if (result) {
              console.log('User updated:', result);
              res.render('profile.ejs', { msg: 'Your details updated successfully', email, type, userData: result });
            } else {
              console.log('User not found');
              res.render('profile.ejs', { msg: 'User not found', email, type, userData: {} });
            }
          } catch (error) {
            console.error('Error updating user:', error);
            res.render('profile.ejs', { msg: 'Error updating user', email, type, userData: {} });
          }
        } else {
          res.render("login.ejs", { msg: "Session Expired, Please login again" });
        }
      }
      


    static logoutController = (req, res) => {
        req.session.destroy(console.log("session destroyed"));
        res.redirect("/login");
    }

    static forgotpasswordController = async (req, res) => {
        const email = req.session.email || ""; 
        const type = req.session.userType || "";
        res.render("forgotpassword.ejs", { msg: "", email, type}); 
    }
    
    static passwordresetController = async (req, res) => {
        const email = req.session.email || ""; 
        const type = req.session.userType || "";
        res.render("passwordreset.ejs", {msg: "", email, type});
    }

    
    static sendemailController = async (req, res) => {
        console.log(req.body);
        const { email } = req.body;
        const confirm_user_in_db = await userDataModel.findOne({ email: email });
    
        if (!confirm_user_in_db) {
            console.log("hello");
            res.render("passwordreset.ejs", { msg: "😢 User Not Found, Please Enter Valid Email" });
        } else {
            // Generate a 6-digit random code
            const randomCode = generateRandomCode();
    
            // Update the user's record with the random code
            await userDataModel.updateOne({ email: email }, { verificationCode: randomCode });
    
            // Create a transporter for sending emails
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'trendify.capstone@gmail.com',
                    pass: 'totwqowcfcutwbik' // Use your Gmail application-specific password
                }
            });
    
            // Create an email with the random code
            const mailOptions = {
                from: 'trendify.capstone@gmail.com',
                to: email,
                subject: "Password Reset Verification Code",
                text: `Hello user,\n\nI hope you are doing great.\n\nYour verification code is: ${randomCode}\n\n Click on this given link to reset your password: http://localhost:2700/forgotpassword.\n\nIf you encounter any issues while updating your password, please feel free to contact our team at trendify.capstone@gmail.com.\n\nThank you!.`
            };
    
            // Send the email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    res.status(500).send("Error sending email.");
                } else {
                    res.redirect('/login'); // Redirect to the login page after sending the email
                }
            });
        }
    };
 
    static updatepasswordController = async (req, res) => {
            try {
                const { email, verificationCode, password, c_password } = req.body;
                const user = await userDataModel.findOne({ email });
        
                if (!user) {
                    return res.render("forgotpassword.ejs", { msg: "User not found, please enter your valid email address" });
                }
        
                if (user.verificationCode !== verificationCode) {
                    return res.render("forgotpassword.ejs", { msg: "Invalid verification code" });
                }
        
                const hashPassword = await bcrypt.hash(password, 10);
        
                await userDataModel.updateOne({ email }, { password: hashPassword, verificationCode: 'default' });
        
                console.log("*** Password updated successfully ***");
                res.render("login.ejs", { msg: "Password updated successfully" });
            } catch (error) {
                console.error("Error updating password:", error);
                res.render("forgotpassword.ejs", { msg: "Password update failed" });
            }
        
    }
    
    static homeController = async (req, res) => {
        const email = req.session.email || ""; 
        const type = req.session.userType || "";
            res.render('home.ejs', {email, type});
    }

    static contactusController = async (req, res) => {
        const email = req.session.email || ""; 
        const type = req.session.userType || "";
        res.render('contactus.ejs', {email, type});
    }
    static aboutusController = async (req, res) => {
        const email = req.session.email || ""; 
        const type = req.session.userType || "";
        res.render('aboutus.ejs', {email, type});
    }
}

module.exports = TrendifyController
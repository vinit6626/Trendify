const adminDataModel = require('../models/userdb.js');
const nodemailer = require('nodemailer');
function generateRandomCode() {
    return Math.floor(100000 + Math.random() * 900000);
}
class AdminControllers {
    static adminLoginController = async (req, res) => {
        res.render('adminlogin.ejs', {msg: ""});
    }

    static registerAdminController = async (req, res) => {
        console.log(req.body);
        // res.render('adminlogin.ejs', {msg: ""});

        const email = req.body.email;
        try {

            const adminData_inserted = await adminDataModel.create({
                email: email,
                userType: "admin"
            });

            const randomCode = generateRandomCode();
    
            await adminDataModel.updateOne({ email: email }, { verificationCode: randomCode });
    
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'trendify.capstone@gmail.com',
                    pass: 'totwqowcfcutwbik' // Use your Gmail application-specific password
                }
            });
            const mailOptions = {
                from: 'trendify.capstone@gmail.com',
                to: 'trendify.capstone@gmail.com', // Replace with the recipient's email
                subject: `${email} Verification Code`,
                html: `
                    <html>
                    <body>
                        <h1>Hello Admin</h1>
                        <p>I hope you are doing great.</p>
                        <p>Here's the verification code for ${email} admin</p>
                        
                        <table border="1" style="border-collapse: collapse;">
                            <tr>
                                <th style="background-color: #007BFF; color: white;">Email</th>
                                <th style="background-color: #007BFF; color: white;">Verification Code</th>
                            </tr>
                            <tr>
                                <td style="background-color: #D4EDDA;">${email}</td>
                                <td style="background-color: #D4EDDA;"><strong>${randomCode}</strong></td>
                            </tr>
                        </table>
                        
                        <p>Please share this code with them.</p>
                        <p>If you encounter any issue, please feel free to contact our developer team.</p>
                        <p>Thank you!</p>
                    </body>
                    </html>
                `
            };
            
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    res.status(500).send("Error sending email.");
                } else {
                    res.redirect('/Trendify_AdminLogin'); 
                }
            });


            res.render("adminregistration.ejs", { msg: "Sign up Successful👍,  get your verification code from Trendify Admin."});
        } catch (error) {
            console.log("--- Sorry data is not added to DB due to error Below -----");
            console.error(error);
            res.render("adminlogin.ejs", { msg: 'Please, sign up with a different email111'});
        }
    }

    static adminUpdatePasswordController = async (req, res) => {
        try {
                const { email, verificationCode, password, c_password } = req.body;
                const user = await adminDataModel.findOne({ email });
        
                if (!user) {
                    return res.render("forgotpassword.ejs", { msg: "User not found, please enter your valid email address" });
                }
        
                if (user.verificationCode !== verificationCode) {
                    return res.render("forgotpassword.ejs", { msg: "Invalid verification code" });
                }
        
                const hashPassword = await bcrypt.hash(password, 10);
        
                await adminDataModel.updateOne({ email }, { password: hashPassword, verificationCode: 'default' });
        
                console.log("*** Password updated successfully ***");
                res.render("login.ejs", { msg: "Password updated successfully" });
            } catch (error) {
                console.error("Error updating password:", error);
                res.render("forgotpassword.ejs", { msg: "Password update failed" });
            }
    
        }

        static createPasswordController = async (req, res) => {
            res.render('adminregistration.ejs', {msg: ""});
        }

        static userVerificationController = async (req, res) => {
            const { email, password } = req.body;
            const confirm_user_in_db = await adminDataModel.findOne({ email: email })
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
    
                } else {
                    res.render("adminlogin.ejs", { msg: "Incorrect Password 😔, Please Enter Valid Password" });
    
                }
            }
        }

}

module.exports = AdminControllers

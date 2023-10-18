const categoryDataModel = require('../models/categorydb.js');


class CategoryControllers {

   static categoryController = async (req, res) => {
        const email = req.session.fname === "default" ? req.session.email : req.session.fname;
        if (req.session.email && req.session.userType) {
            res.render('category/category.ejs', {msg: "", email, type: req.session.userType});
        }else{
            res.render("login.ejs", { msg: "Please login to access our service.", email, type: req.session.userType});
        }
    }
    

    static addCategoryController = async (req, res) => {

        const email = req.session.fname === "default" ? req.session.email : req.session.fname;
        try {
            const findcategory = await categoryDataModel.find({category_name: req.body.categoryName});

            if(findcategory.length > 0) {
                res.render('category/category.ejs', { msg: 'Category already exists', email, type: req.session.userType });

            }else{
                const currentDate = new Date();
                const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

                const categoryData_inserted = await categoryDataModel.create({
                    category_name: req.body.categoryName,
                    category_visibility: req.body.categoryvisibility,
                    category_addedBy: req.session.email,
                    category_updatedBy: "default",
                    category_update_date: "default",
                    category_created_date: formattedDate
                });
            }
            res.redirect("/managecategory");
        } catch (error) {
            console.error(error);
            res.render('category/category.ejs', { msg: 'An error occurred', email, type: req.session.userType });
        }
    }

    static manageCategoryController = async (req, res) => {
        const email = req.session.fname === "default" ? req.session.email : req.session.fname;
        if (req.session.email && req.session.userType) {
          
            try{
                const category_data = await categoryDataModel.find({});
                res.render("category/managecategory.ejs", {msg:"", email, type: req.session.userType, category_data});
            }catch(err){
                console.error(err);
                res.redirect("/home");
            }
        }else{
        res.render("login.ejs", { msg: "Please login to access our service.", email, type: req.session.userType});
        }
    }

    static deleteCategoryController = async (req, res) => {
        try {
            const categoryId = req.params.id;
            const categoryDeleteFromDB = await categoryDataModel.findByIdAndDelete(categoryId);
            res.redirect("/managecategory");
        } catch (error) {
            console.log(error);
            // Handle the error as needed
            res.redirect("/managecategory");
        }
    }

    static editCategoryController = async (req, res) => {
        try {
            const categoryId = req.params.id;
            const categorydata = await categoryDataModel.findById(categoryId);

            const email = req.session.fname === "default" ? req.session.email : req.session.fname;
            res.render("category/editcategory.ejs", { msg:"", email, type: req.session.userType, categorydata})
            // res.redirect("/managecategory");
        } catch (error) {
            console.log(error);
            res.redirect("/managecategory");
        }
    }

    static updateCategoryController = async (req, res) => {
        const email = req.session.fname === "default" ? req.session.email : req.session.fname;
    
        console.log(req.body);
        try {
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

        const updateCategory = await categoryDataModel.findByIdAndUpdate(
            req.body.category_id, 
            {
                category_name: req.body.categoryName,
                category_visibility: req.body.categoryvisibility,
                category_updated_date: formattedDate, 
                category_updatedBy: req.session.email,
            }
        );
            res.redirect("/managecategory");
        } catch (error) {
            console.log(error);
            res.redirect("/managecategory");
        }
    }


}
module.exports = CategoryControllers
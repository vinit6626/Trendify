const productDataModel = require('../models/productdb.js');
const brandDataModel = require('../models/branddb.js');
const categoryDataModel = require('../models/categorydb.js');
const bodyParser = require('body-parser');

// Import the 'fs' module
const fs = require('fs');
const path = require('path');

class ProductControllers {
    
    static productController = async (req, res) => {
      const email = req.session.fname === "default" ? req.session.email : req.session.fname;
      if (req.session.email && req.session.userType) {


    const generateUniqueSKU = async () => {
        let isUnique = false;
        let sku;

        while (!isUnique) {
            sku = Math.floor(Math.random() * 100000).toString();
            const existingProduct = await productDataModel.findOne({ product_sku: sku });
            if (!existingProduct) {
                isUnique = true;
            }
        }
        return sku;
    };

    const uniqueSKU = await generateUniqueSKU();


    const brand = await brandDataModel.find({});
    const visibleBrandCount = await brandDataModel.countDocuments({ brand_visibility: 'visible' });


    

    const category = await categoryDataModel.find({});
    const visibleCategoryCount = await categoryDataModel.countDocuments({ category_visibility: 'visible' });


    res.render('product/product.ejs', { msg: "", email, type: req.session.userType, sku: uniqueSKU, brand, visibleBrandCount,  category, visibleCategoryCount });

    }else{
      res.render("login.ejs", { msg: "Please login to access our service.", email, type: req.session.userType});
    }
  }

    static addProductController = async (req, res) => {
        const email = req.session.fname === "default" ? req.session.email : req.session.fname;
        try {
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
            let joinedSizes;
            if (Array.isArray(req.body.product_size)) {
                joinedSizes = req.body.product_size.join(', ');
            } 
            console.log(joinedSizes);
            console.log(req.body.product_gender);
            console.log("brand type: " + req.body.productType)
            console.log(req.body);

            const productData_inserted = await productDataModel.create({
                product_title: req.body.productName,
                product_description : req.body.productDescription,
                product_sku : req.body.product_sku,
                product_quantity : req.body.productQuantity,
                product_image_path : req.file.filename,
                product_type : req.body.productType,
                product_size : joinedSizes,
                product_category_id : req.body.product_category,
                product_brand_id : req.body.product_brand,
                product_gender : req.body.gender,
                product_price : req.body.productPrice,
                product_visibility : req.body.productvisibility,
                product_addedBy : req.session.email,
                product_updatedBy : "default",
                product_created_date : formattedDate,
                product_updated_date : "default",
            });


            try {
                const updatedCategory = await categoryDataModel.findByIdAndUpdate(
                  req.body.product_category,
                  { $inc: { productCount: 1 } },
                  { new: true } 
                );
                    
                if (!updatedCategory) {
                  console.error('Category not found or not updated.');
                } else {
                  console.log('Category updated successfully:', updatedCategory);
                }
                const updatedBrand = await brandDataModel.findByIdAndUpdate(
                    req.body.product_brand,
                    { $inc: { productCount: 1 } },
                    { new: true } 
                  );
                      
                  if (!updatedBrand) {
                    console.error('Brand not found or not updated.');
                  } else {
                    console.log('Brand updated successfully:', updatedBrand);
                  }

              } catch (err) {
                console.error('Error updating category:', err);
              }
              
            res.redirect("/manageproduct");
        } catch (error) {
            console.error(error);
            res.redirect('/product');
        }
    }

    static manageProductController = async (req, res) => {
        const email = req.session.fname === "default" ? req.session.email : req.session.fname;
        if (req.session.email && req.session.userType) {
          
            try{
                const product_data = await productDataModel.find({});
                const brand_data = await brandDataModel.find({});
                const category_data = await categoryDataModel.find({});
                res.render("product/manageproduct.ejs", {msg:"", email, type: req.session.userType, product_data, brand_data, category_data});
            }catch(err){
                res.redirect("/home");
            }
          }else{
            res.render("login.ejs", { msg: "Please login to access our service.", email, type: req.session.userType});
          }
    }

    static deleteProductController = async (req, res) => {
        try {
            const productId = req.params.id;
            const product_data = await productDataModel.findById(productId);
             console.log(product_data);
             console.log(product_data.product_category_id);
             const categoryID = product_data.product_category_id;
             const brandID = product_data.product_brand_id;
             console.log(categoryID);
             
             
             const image_name = product_data.product_image_path;
            const uploadFolderPath = './upload/';
            const imagePath = path.join(uploadFolderPath, image_name);

            console.log(imagePath);
            
            try {
                const updatedCategory = await categoryDataModel.findByIdAndUpdate(
                    categoryID,
                    { $inc: { productCount: -1 } }, 
                    { new: true } 
                  );
              
                if (!updatedCategory) {
                  console.error('Category not found or not updated.');
                } else {
                  console.log('Category updated successfully:', updatedCategory);
                }

                const updatedBrand = await brandDataModel.findByIdAndUpdate(
                    brandID,
                    { $inc: { productCount: -1 } }, 
                    { new: true } 
                  );
              
                if (!updatedBrand) {
                  console.error('Category not found or not updated.');
                } else {
                  console.log('Category updated successfully:', updatedBrand);
                }
              } catch (err) {
                console.error('Error updating category:', err);
              }

            const productDeleteFromDB = await productDataModel.findByIdAndDelete(productId);
            if (!productDeleteFromDB) {
                console.log(`Brand with ID ${productId} not found.`);
            } else {
              console.log(productDeleteFromDB);
              fs.unlinkSync(`./uploads/${image_name}`);
              console.log(`Image ${image_name} deleted.`);
            }
    
            res.redirect("/manageproduct");
        } catch (error) {
            console.log(error);
            res.redirect("/manageproduct");
        }
    }

    static editProductController = async (req, res) => {
        try {
          const productId = req.params.id;
          const productdata = await productDataModel.findById(productId);
          console.log(productdata);
          const email = req.session.fname === "default" ? req.session.email : req.session.fname;

    const brand = await brandDataModel.find({});
    const visibleBrandCount = await brandDataModel.countDocuments({ brand_visibility: 'visible' });

    const category = await categoryDataModel.find({});
    const visibleCategoryCount = await categoryDataModel.countDocuments({ category_visibility: 'visible' });

          res.render("product/editproduct.ejs", { msg:"", email, type: req.session.userType, productdata, brand, visibleBrandCount, category, visibleCategoryCount});
          // res.redirect("/managecategory");
      } catch (error) {
          console.log(error);
          res.redirect("/manageproduct");
      }
    }

    static updateProductController = async (req, res) => {
       const productId = req.body.productId;
       console.log("id " + productId);
      console.log(req.body);
       //   res.send(req.body.productId);
       let file_name = "";
       if (req.file && req.file.filename) {
        // req.file.filename exists and has a value
        file_name = req.file.filename;
        const image_name = req.body.old_image;
        
          fs.unlinkSync(`./uploads/${image_name}`);
          console.log(`Image ${image_name} deleted.`);
        console.log('File uploaded with filename:', req.file.filename);
      } else {
        file_name = req.body.old_image;
        console.log('No file uploaded or filename is empty.');
      }
      
      console.log(file_name);
      try {

        const oldCategoryUpdate = await categoryDataModel.findByIdAndUpdate(
                  req.body.old_category,
                  { $inc: { productCount: -1 } }, 
                  { new: true } 
                );
            
              if (!oldCategoryUpdate) {
                console.error('Category not found or not updated.');
              } else {
                console.log('Category updated successfully:', oldCategoryUpdate);
              }
      
              const oldBrandUpdate = await brandDataModel.findByIdAndUpdate(
                  req.body.old_brand,
                  { $inc: { productCount: -1 } }, 
                  { new: true } 
                );
            
              if (!oldBrandUpdate) {
                console.error('Category not found or not updated.');
              } else {
                console.log('Category updated successfully:', oldBrandUpdate);
              }
      
                  const updatedCategory = await categoryDataModel.findByIdAndUpdate(
                    req.body.product_category,
                    { $inc: { productCount: 1 } },
                    { new: true } 
                  );
                      
                  if (!updatedCategory) {
                    console.error('Category not found or not updated.');
                  } else {
                    console.log('Category updated successfully:', updatedCategory);
                  }
                  const updatedBrand = await brandDataModel.findByIdAndUpdate(
                      req.body.product_brand,
                      { $inc: { productCount: 1 } },
                      { new: true } 
                    );
                        
                    if (!updatedBrand) {
                      console.error('Brand not found or not updated.');
                    } else {
                      console.log('Brand updated successfully:', updatedBrand);
                    }
      


        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
        let joinedSizes;
        if (Array.isArray(req.body.product_size)) {
            joinedSizes = req.body.product_size.join(', ');
        } 
        console.log(joinedSizes);
        console.log("brand type: " + req.body.productType)
        console.log(req.body);
console.log("file name: " + file_name);
        const productData_inserted = await productDataModel.findByIdAndUpdate(req.body.productId, {
            product_title: req.body.productName,
            product_description : req.body.productDescription,
            product_type : req.body.productType,
            product_size : joinedSizes,
            product_brand_id : req.body.product_brand,
            product_category_id : req.body.product_category,
            product_quantity : req.body.productQuantity,
            product_price : req.body.productPrice,
            product_gender : req.body.gender,
            product_visibility : req.body.productvisibility,
            product_image_path : file_name,
            product_updatedBy : req.session.email,
            product_updated_date : formattedDate,
        });

        if (!productData_inserted) {
          return res.status(500).send("Failed to update product data");
      }
        res.redirect("/manageproduct");
    } catch (error) {
        console.error(error);
        res.redirect('/product');
    }
  }

  static searchProductController = async (req, res) => {
    const email = req.session.fname === "default" ? req.session.email : req.session.fname;

    console.log(req.body);
    function buildMongoQuery(queryObject) {
      const filters = [];
  
      if (queryObject.productName) {
        filters.push({ product_title: queryObject.productName });
      }
  
      if (queryObject.sku) {
        filters.push({ product_sku: queryObject.sku });
      }
  
      if (queryObject.product_brand && queryObject.product_brand !== 'Select Brand') {
        filters.push({ product_brand_id: queryObject.product_brand });
      }
  
      if (queryObject.product_category && queryObject.product_category !== 'Select Category') {
        filters.push({ product_category_id: queryObject.product_category });
      }
  
      if (queryObject.gender) {
        filters.push({ product_gender: queryObject.gender });
      }
  
      if (queryObject.visibility) {
        filters.push({ product_visibility: queryObject.visibility });
      }
  
      const query = { $and: filters };
  
      return query; // Return the query object, not a JSON string
    }
  
    console.log("query");
    const mongoQueryObject = buildMongoQuery(req.body);
    console.log(mongoQueryObject);
    
    const product_data = await productDataModel.find(mongoQueryObject);
    console.log(product_data);
    console.log("product Fetched");

    const brand_data = await brandDataModel.find({});
    const category_data = await categoryDataModel.find({});
    res.render("product/manageproduct.ejs", {msg:"", email, type: req.session.userType, product_data, brand_data, category_data});
  }
  

}
module.exports = ProductControllers
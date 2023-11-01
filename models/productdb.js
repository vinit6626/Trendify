const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
// mongoose.connect("mongodb+srv://trendifycapstone:TrendifyCapstone@cluster0.8lsreoq.mongodb.net/Trendify?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log('DB Connection Successfull'))
// .catch((err) => {
//     console.error(err);
// });

const productDataSchema = mongoose.Schema({
    product_title:  {type: String, default:'default'},
    product_description:  {type: String, default:'default' },
    product_sku:  {type: String, default:'default' },
    product_quantity:  {type: Number, default:'default' },
    product_image_path:  {type: String, default:'default' },
    product_type:  {type: String, default:'default' },
    product_size:  {type: String, default:'default' },
    product_category_id:  {type: String, default:'default' },
    product_brand_id:  {type: String, default:'default' },
    product_gender:  {type: String, default:'default' },
    product_price:  {type: Number, default:'default' },
    product_visibility: {type: String, default:'visible'},
    product_addedBy: {type: String, default: 'default'},
    product_updatedBy: {type: String, default: 'default'},
    product_created_date: {type: String, default: 'default'},
    product_updated_date: {type: String, default: 'default'}
});

const productDataModel = mongoose.model("product", productDataSchema);

module.exports = productDataModel;
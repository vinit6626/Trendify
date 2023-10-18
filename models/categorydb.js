const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
// mongoose.connect("mongodb+srv://trendifycapstone:TrendifyCapstone@cluster0.8lsreoq.mongodb.net/Trendify?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log('DB Connection Successfull'))
// .catch((err) => {
//     console.error(err);
// });

const categoryDataSchema = mongoose.Schema({
    category_name:  {type: String, unique: true},
    category_visibility: {type: String, default:'visible'},
    category_addedBy: {type: String, default: 'default'},
    category_updatedBy: {type: String, default: 'default'},
    category_created_date: {type: String, default: 'default'},
    category_updated_date: {type: String, default: 'default'},
    productCount: {type: Number, default: 0},
})

const categoryDataModel = mongoose.model("category", categoryDataSchema);

module.exports = categoryDataModel;
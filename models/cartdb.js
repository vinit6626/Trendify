const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
// mongoose.connect("mongodb+srv://trendifycapstone:TrendifyCapstone@cluster0.8lsreoq.mongodb.net/Trendify?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log('DB Connection Successfull'))
// .catch((err) => {
//     console.error(err);
// });

const cartDataSchema = mongoose.Schema({
    user_id:  {type: String, default:'user'},
    product_id: {type:String, default:'product_id'},
    size: {type: String, default:'size'},
    quantity: {type: Number, default: 'quantity'},
})

const cartDataModel = mongoose.model("cart", cartDataSchema);

module.exports = cartDataModel;
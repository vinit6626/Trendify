const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
// mongoose.connect("mongodb+srv://trendifycapstone:TrendifyCapstone@cluster0.8lsreoq.mongodb.net/Trendify?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log('DB Connection Successfull'))
// .catch((err) => {
//     console.error(err);
// });

const orderDataSchema = mongoose.Schema({
    order_id: { type: String, default: 'default'},
    product_title:  {type: String, default:'default'},
    product_price:  {type: String, default:'default' },
    product_size:  {type: String, default:'default' },
    product_quantity:  {type: String, default:'default' },
    product_grand_total:  {type: Number, default:'default' },
    user_id : {type: String, default:'default' },
    user_name:  {type: String, default:'default' },
    user_address:  {type: String, default:'default' },
    user_zipcode:  {type: String, default:'default' },
    user_province:  {type: String, default:'default' },
    user_phone: {type: String, default:'visible'},
    card_number: {type: String, default: 'default'},
    card_holder: {type: String, default: 'default'},
    card_expiry: {type: String, default: 'default'},
    card_cvv: {type: String, default: 'default'},
    order_date: {type: String, default: 'default'},
    expected_delivery_date: {type: String, default: 'default'},
    delivered: {type: String, default: 'no'},
    returned: {type: String, default: 'no'},
});

const orderDataModel = mongoose.model("order", orderDataSchema);

module.exports = orderDataModel;
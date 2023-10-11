const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://trendifycapstone:TrendifyCapstone@cluster0.8lsreoq.mongodb.net/Trendify?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log('DB Connection Successfull'))
.catch((err) => {
    console.error(err);
});


const userDataSchema = mongoose.Schema({
    email:  {type: String, unique:true},
    password: {type: String},
    fname: {type: String, default: 'default'},
    lname: {type: String, default: 'default'},
    address: {type: String, default: 'default'},
    zipcode: {type: String, default: 'default'},
    contactno: {type: String, default: 'default'},
    userType: {type: String, default: 'user'},
    date_of_create: {type: String, default: Date.now },
    verificationCode: {type: String, default: 'default'}

})

const userDataModel = mongoose.model("userData", userDataSchema);


module.exports = userDataModel;



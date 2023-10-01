//  Vinit Mohanbhai Dabhi - 8804874

// mongoose import
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
// database connection
mongoose.connect("mongodb+srv://trendifycapstone:TrendifyCapstone@cluster0.8lsreoq.mongodb.net/Trendify?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log('DB Connection Successfull'))
.catch((err) => {
    console.error(err);
});


// create table/schema
const userDataSchema = mongoose.Schema({
    fName: {type: String, default: 'default'},
    lName:  {type: String, default: 'default'}, 
    email:  {type: String, unique:true},
    password: {type: String},
    userType: {type: String, default: 'user'},
    date_of_create: {type: String, default: Date.now },
    verificationCode: {type: String, default: 'default'}
})

// wrraped schema in model
const userDataModel = mongoose.model("userData", userDataSchema);


module.exports = userDataModel;


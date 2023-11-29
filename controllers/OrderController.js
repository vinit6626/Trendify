const orderDataModel = require('../models/orderdb.js');
const cartDataModel = require('../models/cartdb.js');
const nodemailer = require('nodemailer');
const productDataModel = require('../models/productdb.js');
const stripe = require('stripe')('sk_test_51OC8hjCTxZLpN8MpKdGFdaDVwCVsyKyiDv331Ln9OFingWTQnUPaY7DEnEE0rhuMqcD2yuDi9iPZX7QNk8D1pSKy00nGhTVbDO');


class OrderContoller {
    // static orderCheckoutController = async (req, res) => {
    //     console.log(req.body);

    //     const cart_clear = await cartDataModel.deleteMany({ user_id: req.session.email });


    //     const orderData_inserted = await orderDataModel.create({
    //         product_title: JSON.stringify(req.body.product_title),
    //         product_price : JSON.stringify(req.body.price),
    //         product_size : JSON.stringify(req.body.size),
    //         product_quantity : JSON.stringify(req.body.quantity),
    //         product_grand_total : req.body.total,
    //         user_id : req.session.email,
    //         user_name : req.body.fullName,
    //         user_address : req.body.address,
    //         user_zipcode : req.body.zipCode,
    //         user_province : req.body.province,
    //         user_phone : req.body.phoneNumber,
    //         card_number : req.body.cardNumber,
    //         card_holder : req.body.cardHolderName,
    //         card_expiry : req.body.expiryDate,
    //         card_cvv : req.body.cvv,
    //     });
    //     if(orderDataModel){
    //         res.redirect("/home");
    //     }else{
    //         res.redirect("/contactus");
    //     }

    // }

    static orderCheckoutController = async (req, res) => {
      const user = req.session.email;
      console.log(user);
      const userPrefix = user.substring(0, 2);
      const order_id = `${userPrefix}${Date.now()}`;
      const email = req.session.fname === "default" ? req.session.email : req.session.fname;
    
      try {
        console.log('Received data:', req.body);
    
        const { total, fullName, cardNumber, cardHolderName, expiryDate, cvv } = req.body;
    
        if (!total || !fullName ) {
          console.log('Missing required fields:', req.body);
          return res.status(400).json({ error: 'Missing required fields' });
        }
    
        // Create a customer in Stripe and associate it with the user's email
        const customer = await stripe.customers.create({
          name: fullName,
          email: user, // Associate the customer with the user's email
          metadata: {
            order_id: order_id, // Associate the customer with the order ID using metadata
            cardNumber : cardNumber,
            cardHolderName: cardHolderName,
            expiryDate: expiryDate, //
            cvv: cvv
          },
        });
    
        const paymentIntent = await stripe.paymentIntents.create({
          amount: parseFloat(total) * 100,
          currency: 'cad',
          customer: customer.id,
        });
    
        console.log('Payment amount:', total);
        console.log('Customer ID:', customer.id);
    
        // res.status(200).json({ success: true });
        if(res.status(200)){
        const cart_clear = await cartDataModel.deleteMany({ user_id: req.session.email });
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
        const expectedDeliveryDate = new Date(formattedDate);
        expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 7);

            const orderData_inserted = await orderDataModel.create({
                order_id : order_id,
                product_title: JSON.stringify(req.body.product_title),
                product_price : JSON.stringify(req.body.price),
                product_size : JSON.stringify(req.body.size),
                product_quantity : JSON.stringify(req.body.quantity),
                product_grand_total : req.body.total,
                user_id : req.session.email,
                user_name : req.body.fullName,
                user_address : req.body.address,
                user_zipcode : req.body.zipCode,
                user_province : req.body.province,
                user_phone : req.body.phoneNumber,
                order_date: formattedDate,
                expected_delivery_date: expectedDeliveryDate.toISOString().substring(0, 10),
            });
            req.session.cart = 0;
            if(orderDataModel){
              res.redirect(`/orderdetails/${order_id}`)
            }else{
                res.redirect("/login");
            }
        }else{
          res.redirect("/login");
        }
      } catch (error) {
        console.error('Error in /checkout route:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
      }
    }
    
    static orderHistoryController = async (req, res) => {
          const email = req.session.fname === "default" ? req.session.email : req.session.fname;

              const history = await orderDataModel.find({user_id: req.session.email});
              const productItems = await productDataModel.find();
              console.log(history);
              console.log(history.length);
              console.log(productItems);
              res.render("order_history/orderhistory.ejs", {msg: "", email, type: req.session.userType, history, cart: 0, productItems,});
      }

      static orderDetailsController = async (req, res) => {
            const email = req.session.fname === "default" ? req.session.email : req.session.fname;
        const id = req.params.id;

        try {
          const orderDetails = await orderDataModel.find({ order_id: id });

          if (orderDetails.length === 0) {
            // Handle case where no order details are found
            return res.render("order_history/invoice.ejs", { msg: "Order not found", email, type: req.session.userType });
          }

          const productTitles = orderDetails[0].product_title;

          // Check if productTitles is a string and parse it into an array
          const titlesArray = typeof productTitles === 'string' ? JSON.parse(productTitles) : productTitles;

          res.render("order_history/invoice.ejs", {
            msg: "",
            email,
            type: req.session.userType,
            invoice: orderDetails,
            cart: req.session.cartItem,
            productTitles: titlesArray
          });

        } catch (error) {
          console.error('Error in order details route:', error);
          res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
  
      }
      static manageOrderController = async (req, res) => {
        const email = req.session.fname === "default" ? req.session.email : req.session.fname;

        const history = await orderDataModel.find();
        const productItems = await productDataModel.find();
        console.log(history);
        res.render("order_history/manageorders.ejs", {msg: "", email, type: req.session.userType, history, cart: 0, productItems,});  
      }

      static orderStatusController = async (req, res) => {
        const id = req.params.id;
        
        const email = req.session.fname === "default" ? req.session.email : req.session.fname;

        const history = await orderDataModel.find({order_id: id});
        const productItems = await productDataModel.find();
        console.log(history);
        console.log(productItems);
        res.render("manageorder/orderstatus.ejs", {msg: "", email, type: req.session.userType, history, cart: 0, productItems,});  
      }


}

module.exports = OrderContoller

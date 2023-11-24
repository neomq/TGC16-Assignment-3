const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
const cors = require('cors')

// CSURF
const csrf = require('csurf')

// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
  express.urlencoded({
    extended: false
  })
);

app.use(cors());

// set up sessions
// app.use(session({
//   store: new FileStore(),
//   secret: process.env.SESSION_SECRET_KEY,
//   resave: false,
//   saveUninitialized: true
// }))

app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: true
}))

app.use("/public", express.static('public')); 

app.use(flash())

// Register Flash middleware
app.use(function (req, res, next) {
    res.locals.success_messages = req.flash("success_messages");
    res.locals.error_messages = req.flash("error_messages");
    next();
});

// Share the user data with hbs files
app.use(function(req,res,next){
  res.locals.user = req.session.user;
  next();
})

// enable CSRF
// app.use(csrf());
const csurfInstance = csrf();  // creating a prox of the middleware
app.use(function(req,res,next){
  // Disable CSRF for all urls beginning with '/api/'
  // if the url is for the api, exclude from csrf
  // if it is webhook url, then call next() immediately
  if (req.url === '/checkout/process_payment' || 
      req.url.slice(0,5)=='/api/') {
      next();
  } else {
      csurfInstance(req,res,next);
  }
})

// middleware to share the csrf token with all hbs files
app.use(function(req,res,next){
  // the req.csrfToken() generates a new token
  // and save its to the current session
  if (req.csrfToken) {
      res.locals.csrfToken = req.csrfToken();
  }
  next();
})

// middleware to handle csrf errors
// if a middleware function takes 4 arguments
// the first argument is error
app.use(function (err, req, res, next) {
  if (err && err.code == "EBADCSRFTOKEN") {
      req.flash('error_messages', 'The form has expired. Please try again');
      res.redirect('back'); //go back one page
  } else {
      next();
  }
});

// import in routes
const landingRoutes = require('./routes/landing');
const productRoutes = require('./routes/products');
const cloudinaryRoutes = require('./routes/cloudinary');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');

// API routes
const api = {
  products: require('./routes/api/products'),
  essentialoils: require('./routes/api/essentialoils'),
  users: require('./routes/api/users'),
  shoppingcart: require('./routes/api/shoppingCart'),
  checkout: require("./routes/api/checkout")
}

async function main() {
    app.use('/aromaadmin', landingRoutes);
    app.use('/aromaadmin/products', productRoutes);
    app.use('/aromaadmin/cloudinary', cloudinaryRoutes);
    app.use('/aromaadmin/users', userRoutes);
    app.use('/aromaadmin/orders', orderRoutes);

    app.use('/api/products', express.json(), api.products); 
    app.use('/api/essentialoils', express.json(), api.essentialoils);
    app.use('/api/users', express.json(), api.users);
    app.use('/api/cart', express.json(), api.shoppingcart);
    app.use('/api/checkout', api.checkout);
}

main();

app.listen(process.env.PORT, () => {
  console.log("Server has started on port: " + process.env.PORT);
});
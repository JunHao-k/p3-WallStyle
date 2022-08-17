const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const session = require('express-session')
const flash = require('connect-flash')
const FileStore = require('session-file-store')(session)
const csrf = require('csurf')
const helpers = require("handlebars-helpers")({
  handlebars: hbs.handlebars
})

// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// enable forms
app.use(
  express.urlencoded({
    extended: false
  })
);

app.use(session({
  store: new FileStore(), // We want to use files to store sessions
  secret: process.env.SESSION_SECRET_KEY, // Used to generate the session id
  resave: false, // Do we automatically recreate the session even if there is no change to it
  saveUninitialized: true // If a new browser connects do we create a new session
}))


app.use(flash())
// Register Flash messages
app.use(function(req, res, next){
  res.locals.success_messages = req.flash("success_messages")
  res.locals.error_messages = req.flash("error_messages")
  next()
})

// Enable CSRF protection
app.use(csrf())
app.use(function (req, res, next) {
  // The csrfToken function is avaliable because of `app.use(csrf())`
  res.locals.csrfToken = req.csrfToken()
  next()
})




// Set hbs partials
hbs.registerPartials("./views/partials")

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");







const landingRoutes = require("./routes/landing")
const productRoutes = require('./routes/products')
const cloudinaryRoutes = require('./routes/cloudinary.js')
const accountRoutes = require('./routes/accounts.js')

app.use("/", landingRoutes)
app.use("/products", productRoutes)
app.use('/cloudinary', cloudinaryRoutes)
app.use('/accounts' , accountRoutes)




// async function main() {
//   app.get('/' , (req , res) => {
//     res.send("Its alive")
//   })
// }

// main();

app.listen(3000, () => {
  console.log("Server has started");
});
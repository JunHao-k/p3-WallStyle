const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const helpers = require("handlebars-helpers")({
  handlebars: hbs.handlebars
})

// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// Set hbs partials
hbs.registerPartials("./views/partials")

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
  express.urlencoded({
    extended: false
  })
);

const landingRoutes = require("./routes/landing")
const productRoutes = require('./routes/products')
const cloudinaryRoutes = require('./routes/cloudinary.js')

app.use("/", landingRoutes)
app.use("/products", productRoutes)
app.use('/cloudinary', cloudinaryRoutes)




// async function main() {
//   app.get('/' , (req , res) => {
//     res.send("Its alive")
//   })
// }

// main();

app.listen(3000, () => {
  console.log("Server has started");
});
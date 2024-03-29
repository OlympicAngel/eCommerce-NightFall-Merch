require("dotenv").config();
require("./config/database")();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");


const users_router = require("./routes/users_router");
const products_router = require("./routes/products_router");
const carts_router = require("./routes/carts_router");
const orders_router = require("./routes/orders_router");
const categories_router = require("./routes/categories_router");


var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://localhost:5174", 'http://10.100.102.81:5173'],
    optionsSuccessStatus: 200,
  })
);


app.use('/users', users_router);
app.use('/products', products_router);
app.use('/carts', carts_router);
app.use('/orders', orders_router);
app.use('/categories', categories_router);


app.listen(process.env.PORT, console.log.bind(null, "Running server on port:", process.env.PORT))

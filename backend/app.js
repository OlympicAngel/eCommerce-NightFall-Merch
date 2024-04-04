require("dotenv").config();
require("./config/database")();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");


const users_router = require("./routes/users_router");
const products_router = require("./routes/products_router");
const orders_router = require("./routes/orders_router");
const categories_router = require("./routes/categories_router");


const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//security staff
//prevent common attacks
app.use(helmet({
  contentSecurityPolicy: false
}))
//allow only specific origins
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://localhost:5174", 'http://10.100.102.81:5173'],
    optionsSuccessStatus: 200,
  })
);


app.use('/users', users_router);
app.use('/products', products_router);
app.use('/orders', orders_router);
app.use('/categories', categories_router);


//override error pages - preventing express fingerprint
// custom 404
app.use((req, res, next) => { res.status(404).send("Sorry can't find that!") })

// custom error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(process.env.PORT, console.log.bind(null, "Running server on port:", process.env.PORT))

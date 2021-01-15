const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const env = require('dotenv');
env.config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const cors = require("cors");

mongoose.connect(process.env.mongoConnection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

if (process.env.profile === "dev") {
  mongoose.connection.once("open", () => {
    console.log('connected to the mongo atlas instance successfully')
  });
}


// import all routes and add them to the main app
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const countryCurrencyRouter = require('./routes/country_currency');
const productsRouter = require('./routes/products');
const merchantDispatcherRouter = require('./routes/merchant_dispatcher')
const ordersRouter = require('./routes/orders')
const cartRouter = require("./routes/cart")
const app = express();
app.set('view engine', 'pug')
app.set('views', __dirname + '/views');
(process.env.profile === "dev") ? app.use(logger('combined')) : app.use(logger('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/country-currency', countryCurrencyRouter);
app.use('/products', productsRouter);
app.use('/merchant-dispatcher', merchantDispatcherRouter);
app.use('/orders', ordersRouter);
app.use('/cart', cartRouter);

module.exports = app;

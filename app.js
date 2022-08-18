require('dotenv/config');
const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');

//Middleware
app.use(express.json());
app.use(morgan('tiny'));

//Routes
const categoriesRoutes = require('./routers/categories');
const productsRoutes = require('./routers/products');
const usersRoutes = require('./routers/users');
const ordersRoutes = require('./routers/orders');

const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);



mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'eshop-db'
})
    .then(() => console.log('Connection is ready'))
    .catch(err => console.log(err));
app.listen(3000, () =>
{
    console.log(`Server running on port ${api}`);
})
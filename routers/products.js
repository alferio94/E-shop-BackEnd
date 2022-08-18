const express = require('express');
const rotuter = express.Router();
const { Product } = require('../models/product');

rotuter.get(`/`, async (req, res) =>
{
    const productList = await Product.find();
    productList ? res.send(productList) : res.status(404).send('No products found');
});
rotuter.post(`/`, (req, res) =>
{
    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock
    });
    product.save()
        .then(() => res.status(201).json(product))
        .catch(error => res.status(400).json({ error }));
});

module.exports = rotuter;
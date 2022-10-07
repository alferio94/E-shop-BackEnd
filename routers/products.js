const express = require('express');
const { Category } = require('../models/category');
const { Product } = require('../models/product');
const router = express.Router();
const mongoose = require('mongoose');

router.get(`/`, async (req, res) =>
{
    const productList = await Product.find();
    productList ? res.send(productList) : res.status(404).send('No products found');
});
/* router.get(`/`, async (req, res) =>
{
    const productList = await Product.find().select('name image');
    productList ? res.send(productList) : res.status(404).send('No products found');
}); */

//post a producto nuevo
router.post(`/`, async (req, res) =>
{
    //Revisamos que el ID de la categoria sea Valido
    if (!mongoose.isValidObjectId(req.body.category)) return res.status(400).send('Invalid Category Id')

    //Buscamos que la categoria Exista
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category')

    //Creamos un nuevo Product Schema
    let product = new Product(req.body);

    //Hacemos el guardado del producto
    const productSaved = await product.save();
    //Mandamos Respuesta HTTP
    productSaved ? res.send(productSaved) : res.status(500).send('The product cannot be created');
});

router.put(`/:id`, async (req, res) =>
{
    if (!mongoose.isValidObjectId(req.params.id) || !mongoose.isValidObjectId(req.body.category)) return res.status(400).send('Invalid Product Id or Category Id')
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    product ? res.send(product) : res.status(500).send('the product cannot be updated!');
});

router.get(`/:id`, async (req, res) =>
{
    const product = await Product.findById(req.params.id).populate('category');
    product ? res.status(200).send(product) : res.status(404).send('No product found');
});


router.delete(`/:id`, (req, res) =>
{
    Product.findByIdAndRemove(req.params.id)
        .then(product =>
        {
            product ?
                res.send('The product with the given ID was deleted.')
                : res.status(404).send('The product with the given ID was not found.');
        }).catch(err => res.status(400).send(err));
});

router.get('/get/count', async (req, res) =>
{

    const productCount = await Product.countDocuments()

    productCount ? res.send({ productCount }) : res.status(500).json({ success: false })

})
module.exports = router; 
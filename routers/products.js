const express = require('express');
const { Category } = require('../models/category');
const { Product } = require('../models/product');
const router = express.Router();
const mongoose = require('mongoose');

router.get(`/`, async (req, res) =>
{
    //iniciamos una variable filtro por si acaso necesitamos filtrar los productos 
    let filter = {};
    //preguntamos si tenemos algunos queries en la url ejemplo htttp:localhost:3000/api/v1/products?categories=categoryID1,categoryID2
    if (req.query.categories)
    {
        //Agregamos al objeto filtro un arreglo de id de categorias que se dividen por ","
        filter = {
            category: req.query.categories.split(',')
        };
    }
    //Hacemos la busqueda de los productos en caso de no tener query de categorias retornara todos, de caso contrario solo los que cumplan con el filtro
    //El metodo Populate es un metodo de mongoose que nos permite traer los datos de la categoria completos ya que en el schema solo tenemos el Id de la categoria
    const productList = await Product.find(filter).populate('category');
    productList ? res.send(productList) : res.status(404).send('No products found');
});
/* 
Este Feature aun estamos pensando en si ponerlo o no, ya que para temas de performance es mas facil traer algunos parametros de los productos
cuando se muestran en lista (nombre e imagen) de esta forma hacemos mas ligera la peticion.

router.get(`/`, async (req, res) =>
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
    //Validamos los formatos de ID de producto y de la categoria
    if (!mongoose.isValidObjectId(req.params.id) || !mongoose.isValidObjectId(req.body.category)) return res.status(400).send('Invalid Product Id or Category Id')
    //Revisamos que la categoria Exista
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');
    //Actualizamos y retonarmos el producto actualizado
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    product ? res.send(product) : res.status(500).send('the product cannot be updated!');
});

//Buscamos producto por ID
router.get(`/:id`, async (req, res) =>
{
    const product = await Product.findById(req.params.id).populate('category');
    product ? res.status(200).send(product) : res.status(404).send('No product found');
});

//Buscamos producto por ID y lo removemos de la BD.
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

//Para temas de reportes traemos el conteo de todos los productos
router.get('/get/count', async (req, res) =>
{

    const productCount = await Product.countDocuments()

    productCount ? res.send({ productCount }) : res.status(500).json({ success: false })

});

//Hacemos un filtrado para los productos que van a ser promocionados en la pagina principal bajo el atributo isFeatured, con opcion a limitarlo a un numero especifico
//este numero lo consideramos como el valor /:count? en casi de no venir el valor traera a todos los productos que tengan isFeatured, de tener un valos solo traera ese numero de registros
router.get(`/get/featured/:count?`, async (req, res) =>
{
    //Validamos que venga :count en caso contrario lo asignamos a 0 lo cual hara que regrese la lista completa de productos con isFeatured.
    const count = req.params.count ? req.params.count : 0
    const products = await Product.find({ isFeatured: true }).populate('category').limit(+count);

    if (!products)
    {
        res.status(500).json({ success: false })
    }
    res.send(products);
});


module.exports = router; 
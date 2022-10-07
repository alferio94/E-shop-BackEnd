//Destructuracion del archivo category.
const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

//Obtener todas las categorias
//cada metodo de router ocupa un path(string) y un callback(llamado a una funcion) como parametros
//http get localhost:3000/api/v1/categories/
router.get(`/`, async (req, res) =>
{
    const categoryList = await Category.find();

    //json
    categoryList ? res.status(200).send(categoryList) : res.status(404).send('No categories found');
});



//Obtener Categoria por ID
//http get localhost:3000/api/v1/categories/gdsy53453uada123fgfa2136
//http code 200 = ok
router.get(`/:id`, async (req, res) =>
{
    const category = await Category.findById(req.params.id);
    category ? res.status(200).send(category) : res.status(404).send('Category not found');
});


//Crear nueva categoria
//mandamos un json con la categoria
//http post localhost:3000/api/v1/categories/

//post localhost:3000/api/v1/categories/
/*  post.body({
    name: 'beauty',
    color: '#ffffff',
    icon: 'fa-sharp fa-solid fa-check'
}) */
router.post(`/`, async (req, res) =>
{
    let category = new Category(req.body);

    const result = await category.save();

    //http code created
    result ? res.status(201).send(result) : res.status(400).send('Error saving category');
});


//Editar categoria
router.put(`/:id`, async (req, res) =>
{
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    category ? res.status(201).send(category) : res.status(404).send('Category not found');
});


//Eliminar Catergoria
router.delete(`/:id`, (req, res) =>
{
    Category.findByIdAndDelete(req.params.id)
        .then(category =>
        {
            category ?
                res.status(200).send('The category with the given ID was deleted.')
                : res.status(404).send('The category with the given ID was not found.');
        }).catch(err => res.status(400).send(err));
});

module.exports = router;
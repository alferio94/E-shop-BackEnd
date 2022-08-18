const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) =>
{
    const categoryList = await Category.find();

    categoryList ? res.status(200).send(categoryList) : res.status(404).send('No categories found');
});

router.get(`/:id`, async (req, res) =>
{
    const category = await Category.findById(req.params.id);
    category ? res.status(200).send(category) : res.status(404).send('Category not found');
});

router.post(`/`, async (req, res) =>
{
    let category = new Category(req.body);

    const result = await category.save();

    result ? res.send(result) : res.status(400).send('Error saving category');
});

router.put(`/:id`, async (req, res) =>
{
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    category ? res.status(201).send(category) : res.status(404).send('Category not found');
});

router.delete(`/:id`, (req, res) =>
{
    Category.findByIdAndRemove(req.params.id)
        .then(category =>
        {
            category ?
                res.status(200).send('The category with the given ID was deleted.')
                : res.status(404).send('The category with the given ID was not found.');
        }).catch(err => res.status(400).send(err));
});

module.exports = router;
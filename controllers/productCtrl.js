const { default: slugify } = require('slugify');
const Product = require('../models/ProductModel');
const asyncHandler = require('express-async-handler');
const { json } = require('express');
 
const createProduct = asyncHandler(async(req, res) => {

// slug checking
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }
    }
    catch(error){
        throw new Error("slugify is not working")
    }

// creating an new Product
    try{
const newProduct = await Product.create(req.body);
console.log("product created");
res.json(req.body)
    }
    catch(error){
        throw new Error(error)
    }
});

// Updating an Product
const updateProduct = asyncHandler(async(req, res) => {
    const {id} =  req.params
    console.log(req.body);
    console.log(id);
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }
        const updated = await Product.findOneAndUpdate({_id: id}, req.body,
        {new: true},);
        res.json(updated);

    }
    catch(error){
        throw new Error(error);
    }
});

// Deleting an Product
const deleteProduct = asyncHandler(async(req, res) => {
    const {id} =  req.params
    console.log(id);
    try{
        const updated = await Product.findByIdAndDelete(id)
        res.json("product is deleted");
    }
    catch(error){
        throw new Error(error);
    }
})

// get the product by ID
const getProduct = asyncHandler(async(req, res) => {
    console.log("getProduct");
    const {id} = req.params
    try{
    const findProduct = await Product.findById(id)
    res.json(findProduct);
}
catch(error){
    throw new Error(error)
}
}
)

// getting an all products
const getAllProduct = asyncHandler(async(req, res) => {
    console.log("getAllproduct is called");
    // console.log(req.query);

    const queryObj = {...req.query};

    const excludeFields = ['page', 'sort', 'field', 'limits']

    excludeFields.forEach((el)=> delete queryObj[el]);

    let queryString = JSON.stringify(queryObj);

    // queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

    console.log('queryString', JSON.parse(queryString));

    try{
    const findAllProduct = await Product.find(JSON.parse(queryString));
    res.json(findAllProduct);
}
catch(error){
    throw new Error(error)
}
}
)


module.exports = {createProduct, getProduct, getAllProduct, updateProduct, deleteProduct}
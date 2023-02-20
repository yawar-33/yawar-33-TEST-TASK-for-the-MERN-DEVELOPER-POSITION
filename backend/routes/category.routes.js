const express = require("express");
const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory, getAllCategorieswithoutPagination } = require("../controllers/category.controller");
const { isValidCategory } = require("../middleware/category.validation");
const { requireSignin } = require("../middleware/token.validation");
const router = express.Router();

//requireSignin  will check JWT authorization 
// isValidCategory will check if name etc is provided making sure things should not be empty 

router.post('/category/save', requireSignin, isValidCategory, createCategory)    // save new category
router.get('/category/get', requireSignin, getAllCategories)// find all with  with pagination
router.get('/category/getall', requireSignin, getAllCategorieswithoutPagination) // without pagination
router.get('/category/getbyid/:id', requireSignin, getCategoryById) // find by id 
router.patch('/category/update/:id', requireSignin, isValidCategory, updateCategory) // update categ 
router.delete('/category/deletebyid/:id', requireSignin, deleteCategory) // delete categ



module.exports = router;
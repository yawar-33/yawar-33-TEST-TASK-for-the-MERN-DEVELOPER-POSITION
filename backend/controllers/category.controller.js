const Category = require('../models/category');

// Create a new category
const createCategory = async (req, res) => {
    const { name } = req.body;
    const category = new Category({ name });
    try {
        const newCategory = await category.save();
        res.status(200).json(newCategory);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all categories
const getAllCategories = async (req, res) => {
    const pageNum = parseInt(req.query.pageNum) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    try {
        const totalCount = await Category.countDocuments();  /// total count 
        const categories = await Category.find().sort('name').skip((pageNum - 1) * pageSize) // query 
            .limit(pageSize);;
        const totalPages = Math.ceil(totalCount / pageSize);     // total page calculation 
        res.status(200).json({ categories, totalCount, totalPages });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all categories  without Paginations
const getAllCategorieswithoutPagination = async (req, res) => {
    try {
        const categories = await Category.find().sort('name')
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// Get a single category
const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(400).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a category
const updateCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findByIdAndUpdate(id, { name: req.body.name }, { new: true });
        if (!category) {
            return res.status(400).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a category
const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(400).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getAllCategorieswithoutPagination
};

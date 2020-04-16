const Category = require('../models/category');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = async (req, res) => {
    
    try {
        const { name } = req.body;
        let slug = slugify(name).toLowerCase();
        let category = new Category({ name, slug });
        let data = await category.save();
        res.json(data);        

    }
    catch(err){
        return res.status(400).json({
            error: errorHandler(err)
        });
    }
    
};

exports.list = async (req, res) => {

    try {
        let data = await Category.find({});
        res.json(data);
    }
    catch(err) {
        return res.status(400).json({
            error: errorHandler(err)
        });
    }    
};

exports.read = async (req, res) => {

    const slug = req.params.slug.toLowerCase();

    try {
        const category = await Category.findOne({slug});
        res.json(category);
    }
    catch(err) {
        return res.status(400).json({
            error: errorHandler(err)
        });   
    }
   
};

exports.remove = async (req, res) => {
    const slug = req.params.slug.toLowerCase();

    try {
        await Category.findOneAndRemove({ slug });  
        res.json({
            message: 'Category deleted successfully'
        });
    }
    catch(err) {
        return res.status(400).json({
            error: errorHandler(err)
        });
    }  
    
};



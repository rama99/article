const Article = require('../models/Article');
const Category = require('../models/category');
const formidable = require('formidable');
const slugify = require('slugify');
const stripHtml = require('string-strip-html');
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandler');
const fs = require('fs');
const { smartTrim } = require('../helpers/article'); 


exports.create = async (req, res) => {

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not upload'
            });
        }

        const { title, body, categories } = fields;

        if (!title || !title.length) {
            return res.status(400).json({
                error: 'title is required'
            });
        }

        if (!body || body.length < 200) {
            return res.status(400).json({
                error: 'Content is too short'
            });
        }

        if (!categories || categories.length === 0) {
            return res.status(400).json({
                error: 'At least one category is required'
            });
        }
        

        let article = new Article();
        article.title = title;
        article.body = body;
        article.excerpt = smartTrim(body, 320, ' ', ' ...');
        article.slug = slugify(title).toLowerCase();
        article.mtitle = `${title} | ${process.env.APP_NAME}`;
        article.mdesc = stripHtml(body.substring(0, 160));
        article.postedBy = req.user._id;
        // categories 
        let arrayOfCategories = categories && categories.split(',');        

        if (files.photo) {
            if (files.photo.size > 10000000) {
                return res.status(400).json({
                    error: 'Image should be less then 1mb in size'
                });
            }
            article.photo.data = fs.readFileSync(files.photo.path);
            article.photo.contentType = files.photo.type;
        }
    });

    try {
            const result0 = await article.save();
            const result = await Article.findByIdAndUpdate(result0._id, { $push: { categories: arrayOfCategories } }, { new: true });
            res.json(result);

    }
    catch(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
    }
   
};


exports.list = async (req, res) => {

    try {

      let data =  await Article.find({})
        .populate('categories', '_id name slug')        
        .populate('postedBy', '_id name username')
        .select('_id title slug excerpt categories postedBy createdAt updatedAt');
        
        res.json(data);
        
    }
    catch(err) {
        return res.json({
            error: errorHandler(err)
        });
    }
    
};


exports.listAllAriticlesCategories = async (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    let articles;
    let categories;
    
    try {

        const data = await Article.find({})
                        .populate('categories', '_id name slug')       
                        .populate('postedBy', '_id name username profile')
                        .sort({ createdAt: -1 })
                        .skip(skip)
                        .limit(limit)
                        .select('_id title slug excerpt categories postedBy createdAt updatedAt');

        articles = data;   
        
        // get all categories
        let c = await Category.find({});
        categories = c; // categories
        res.json({ articles, categories, size: articles.length }); 

    }
    catch(err) {
        return res.json({
            error: errorHandler(err)
        });
    }       
};


exports.read = async (req, res) => {

    try {
        const slug = req.params.slug.toLowerCase();

        const data = await   Article.findOne({ slug })
                                // .select("-photo")
                                .populate('categories', '_id name slug')      
                                .populate('postedBy', '_id name username')
                                .select('_id title body slug mtitle mdesc categories postedBy createdAt updatedAt');
        res.json(data);                        
                                
    }
    catch(err) {
        return res.json({
            error: errorHandler(err)
        });
    }       
};


exports.remove = async (req, res) => {

    try {
        const slug = req.params.slug.toLowerCase();
        await Article.findOneAndRemove({ slug });
        res.json({
            message: 'Article deleted successfully'
        });
    }
    catch(err) {
        return res.json({
            error: errorHandler(err)
        });
    }
   
};


exports.update = async (req, res) => {
    const slug = req.params.slug.toLowerCase();

    try {

      const  oldArticle = Article.findOne({ slug });

      let form = new formidable.IncomingForm();
        form.keepExtensions = true;

        form.parse(req, (err, fields, files) => {

            if (err) {
                return res.status(400).json({
                    error: 'Image could not upload'
                });
            }

            let slugBeforeMerge = oldArticle.slug;
            oldArticle = _.merge(oldArticle, fields);
            oldArticle.slug = slugBeforeMerge;

            const { body, desc, categories } = fields;

            if (body) {
                oldArticle.excerpt = smartTrim(body, 320, ' ', ' ...');
                oldArticle.desc = stripHtml(body.substring(0, 160));
            }

            if (categories) {
                oldArticle.categories = categories.split(',');
            }
            

            if (files.photo) {
                if (files.photo.size > 10000000) {
                    return res.status(400).json({
                        error: 'Image should be less then 1mb in size'
                    });
                }
                oldArticle.photo.data = fs.readFileSync(files.photo.path);
                oldArticle.photo.contentType = files.photo.type;
            }

            const result = oldArticle.save();
            // result.photo = undefined;
            res.json(result);
           
        });

    }
    catch(err) { 

            return res.status(400).json({
                error: errorHandler(err)
            });
    }
    
};

exports.photo = async (req, res) => {
    const slug = req.params.slug.toLowerCase();

    try {
       const article = await Article.findOne({ slug })
                              .select('photo');

        if (!article) {
            return res.status(400).json({
                error: errorHandler(`error`)
            });  
        } 
        
        res.set('Content-Type', article.photo.contentType);
        res.send(article.photo.data);

    }
    catch(err) {
        return res.status(400).json({
            error: errorHandler(err)
        });
    }    
      
};



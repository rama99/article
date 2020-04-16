const Article = require('../models/Article');
const Category = require('../models/category');
const formidable = require('formidable');
const slugify = require('slugify');
const stripHtml = require('string-strip-html');
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandler');
const fs = require('fs');
const { smartTrim } = require('../helpers/article');

exports.create = (req, res) => {
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

        article.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            // res.json(result);
            Article.findByIdAndUpdate(result._id, { $push: { categories: arrayOfCategories } }, { new: true }).exec(
                (err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        });
                    } 
                }
            );
        });
    });
};



exports.list = (req, res) => {
    Article.find({})
        .populate('categories', '_id name slug')        
        .populate('postedBy', '_id name username')
        .select('_id title slug excerpt categories postedBy createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};

exports.listAllAriticlesCategories = (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    let articles;
    let categories;    

    Article.find({})
        .populate('categories', '_id name slug')       
        .populate('postedBy', '_id name username profile')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('_id title slug excerpt categories postedBy createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            articles = data; 
            // get all categories
            Category.find({}).exec((err, c) => {
                if (err) {
                    return res.json({
                        error: errorHandler(err)
                    });
                }
                categories = c; // categories

                res.json({ blogs, categories, size: blogs.length });                
            });
        });
};

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Article.findOne({ slug })
        // .select("-photo")
        .populate('categories', '_id name slug')      
        .populate('postedBy', '_id name username')
        .select('_id title body slug mtitle mdesc categories postedBy createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};

exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Article.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Article deleted successfully'
        });
    });
};

exports.update = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Article.findOne({ slug }).exec((err, oldArticle) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

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

            oldArticle.save((err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                // result.photo = undefined;
                res.json(result);
            });
        });
    });
};

exports.photo = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Article.findOne({ slug })
        .select('photo')
        .exec((err, article) => {
            if (err || !article) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.set('Content-Type', article.photo.contentType);
            return res.send(article.photo.data);
        });
};


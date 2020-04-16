const express = require('express');
const router = express.Router();
const {
    create,
    list,  
    listAllAriticlesCategories,
    read,
    remove,
    update,
    photo
} = require('../controllers/article');

const { requireSignin, adminMiddleware } = require('../controllers/auth');

router.post('/articles', requireSignin, adminMiddleware, create);
router.get('/articles', list);
router.post('/articles-categories', listAllAriticlesCategories);
router.get('/articles/:slug', read);
router.delete('/articles/:slug', requireSignin, adminMiddleware, remove);
router.put('/articles/:slug', requireSignin, adminMiddleware, update);
router.get('/articles/photo/:slug', photo);

module.exports = router;
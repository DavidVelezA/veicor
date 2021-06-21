'use strict'

var express = require('express');
var ProductController = require('../controllers/product.controller');

var router = express.Router();
var md_auth = require('../middlewares/authenticate');



//rutas de products api
router.post('/products', md_auth.authenticated, ProductController.save);
router.get('/products/:page?',  ProductController.getProducts);
router.get('/product/:id',  ProductController.getProduct);
router.put('/product/:id', md_auth.authenticated, ProductController.updateProduct);
router.delete('/product/:id', md_auth.authenticated, ProductController.deleteProduct);
router.get('/search/:search', ProductController.search);






module.exports = router;
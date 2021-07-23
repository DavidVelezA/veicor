'use strict'

var express = require('express');
var ProductController = require('../controllers/product.controller');

var router = express.Router();
var md_auth = require('../middlewares/authenticate');



//rutas de products api
router.post('/products', ProductController.save);
router.get('/products/:page?',  ProductController.getProducts);
router.get('/product/:id',  ProductController.getProduct);
router.put('/product/:id', ProductController.updateProduct);
router.delete('/product/:id', ProductController.deleteProduct);
router.get('/search/:search', ProductController.search);






module.exports = router;
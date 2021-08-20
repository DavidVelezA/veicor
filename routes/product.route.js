'use strict'

var express = require('express');
var ProductController = require('../controllers/product.controller');

var router = express.Router();
var md_auth = require('../middlewares/authenticate');
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/products' });



//rutas de products api
router.post('/products', ProductController.save);
router.get('/products/:page?',  ProductController.getProducts);
router.get('/product/:id',  ProductController.getProduct);
router.put('/product/:id', ProductController.updateProduct);
router.delete('/product/:id', ProductController.deleteProduct);
router.get('/search/:search', ProductController.search);
router.post('/upload-img', [md_upload], ProductController.uploadImg);
router.get('/img/:fileName', ProductController.getImage);





module.exports = router;
'use strict'

var express = require('express');
var CategoriaController = require('../controllers/categoria.controller');

var router = express.Router();



//rutas de products api
router.post('/categoria',  CategoriaController.save);
router.get('/categorias',  CategoriaController.getCategoria);
// router.delete('/carrito/:itemId', CarritoController.deleteItemCarrito);
// router.get('/product/:id',  ProductController.getProduct);
// router.put('/product/:id', md_auth.authenticated, ProductController.updateProduct);
// router.get('/search/:search', ProductController.search);






module.exports = router;
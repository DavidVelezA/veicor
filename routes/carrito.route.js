'use strict'

var express = require('express');
var CarritoController = require('../controllers/carrito.controller');

var router = express.Router();
var md_auth = require('../middlewares/authenticate');



//rutas de products api
router.post('/carrito', md_auth.authenticated, CarritoController.save);
router.get('/carrito', md_auth.authenticated, CarritoController.getCarritoByUser);
router.delete('/carrito/:itemId', md_auth.authenticated, CarritoController.deleteItemCarrito);

router.get('/carritos', CarritoController.getCarritos);
router.get('/carrito-admin/:user', CarritoController.getCarritoAdmin);
router.get('/cambiar-admin/:user', CarritoController.cambiarEstado);



// router.get('/product/:id',  ProductController.getProduct);
// router.put('/product/:id', md_auth.authenticated, ProductController.updateProduct);
// router.get('/search/:search', ProductController.search);







module.exports = router;
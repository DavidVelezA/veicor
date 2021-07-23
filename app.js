'use strict'

// crear servidor web NodeJS y express

//Requires
var express = require('express');
var bodyParser = require('body-parser');

//Ejecutar express
var app = express();

//Cargar archivos de rutas
var user_routes = require('./routes/user.route')
var product_routes = require('./routes/product.route')
var carrito_routes = require('./routes/carrito.route')
var categoria_routes = require('./routes/categoria.route')

// var answer_routes = require('./routes/answer.route')




// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


// Reescribir rutas
app.use('/api', user_routes);
app.use('/api', product_routes);
app.use('/api', carrito_routes);
app.use('/api', categoria_routes
);



// Exportar modulo
module.exports = app;
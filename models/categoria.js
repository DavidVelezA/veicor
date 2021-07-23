'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//paginacion y adjuntarlo a un schema

// var productsSchema = new Product()

var CategoriaSchema = Schema({
    nombre: String,
 
});

module.exports = mongoose.model('Categoria', CategoriaSchema);

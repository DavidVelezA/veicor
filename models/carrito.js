'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//paginacion y adjuntarlo a un schema

// var productsSchema = new Product()

var CarritoSchema = Schema({
    user: { type: Schema.ObjectId, ref: 'User' },
    products: [{ type: Schema.ObjectId, ref: 'Product' }],
    // order: String
 
});

module.exports = mongoose.model('Carrito', CarritoSchema);

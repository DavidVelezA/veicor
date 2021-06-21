'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//paginacion y adjuntarlo a un schema
var mongoosePaginate = require('mongoose-paginate-v2');



// modelo de PRODUCT
var ProductSchema = Schema({
    title: String,
    content: String,
    category: String,
    price: String,
    image: String,
    quantity: String

});


// var CarritoSchema = Schema({
//     user: { type: Schema.ObjectId, ref: 'User' },
//     products: [ProductSchema],
 
// });

// cargar paginacion 
ProductSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', ProductSchema);
// module.exports = mongoose.model('Carrito', CarritoSchema);

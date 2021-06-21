'use strict'

var validator = require('validator');
var Carrito = require('../models/carrito');
// var bcrypt = require('bcrypt-nodejs');
// var jwt = require('../services/jwt')
// var fs = require('fs');
// var path = require('path');

var controller = {

    save: function (req, res) {

        var params = req.body;

        try {
            //validar datos
            var validate_user = !validator.isEmpty(req.user.sub);
            var validate_product = !validator.isEmpty(params.product);

        } catch (err) {
            return res.status(200).send({
                message: "Faltan datos por enviar"
            });

        }
        if (validate_user && validate_product) {


            Carrito.find({
                user: req.user.sub
            }).exec((err, carro) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al hacer la consulta'

                    });

                }

                if (carro.length == 0) {


                    //crear objeto de carrito

                    var carrito = new Carrito();

                    // asignar valores al product
                    carrito.user = req.user.sub;
                    carrito.products = params.product;
                    // carrito.order = params.order;


                    // guardar carrito
                    carrito.save((err, carritoStored) => {
                        if (err) {
                            return res.status(500).send({
                                status: 'error',
                                message: "Error al guardar "
                            });

                        }
                    
                        if (!carritoStored) {
                            return res.status(500).send({
                                status: 'error',
                                message: "El product no se ha guardado"
                            });

                        }
                        // devolver respuesta


                        return res.status(200).send({ status: 'success', carritoStored });
                    }); // close save

                } else {
         
                    var update = {
                        products: [...carro[0].products, params.product],

                    };
                                     

                    // find and update del topic por id y por id de usuario

                    Carrito.findOneAndUpdate({ user: req.user.sub }, update, { new: true }, (err, carroUpdate) => {

                        if (err) {

                            return res.status(500).send({
                                status: 'error',
                                message: 'error en la peticion'

                            });

                        }
                        if (!carroUpdate) {
                            return res.status(404).send({
                                status: 'error',
                                message: 'No se ha atualizado el carro'

                            });


                        }
                        // devolver respuesta
                        return res.status(200).send({
                            status: 'successs',
                            carroUpdate

                        });
                    });
                }

            });

        } else {
            return res.status(200).send({
                message: "Validacion de datos incorrecta, intentelo nuevamente"

            });
        }

    },

    getCarritoByUser: function (req, res) {

        // find 
        Carrito.find({
            user: req.user.sub
        }).populate('products').exec((err, carrito) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al hacer la consulta'

                });

            }
            if (carrito.length == 0) {
           
                return res.status(404).send({
                    status: 'notfound',
                    message: 'No hay products que mostrar'

                });

            }
            // devolver resultado 

            return res.status(200).send({
                status: 'success',
                carrito

            });
        });
    },     

    deleteItemCarrito: function (req, res) {
            // sacar el id del topic y del comment de la url
            // var topicId = req.params.topicId;
            var itemId = req.params.itemId;
    
            //buscar el topic
            Carrito.find({user: req.user.sub}).exec((err, carrito) => {
    
                // Topic.findById(topicId, (err, topic) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'error en la peticion'
                    });
    
                }
                if (!carrito) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el carrito'
                    });
                } else {
    
                    //seleccionar el subdocumento (comentario)

                    const items = carrito[0].products.filter(function(carro) {
                        return carro != itemId; 
                    });   
                    
                    const update = {
                        products: items
                    }
     
                    // borrar el comentario
                    Carrito.findOneAndUpdate({ user: req.user.sub }, update, { new: true }, (err, carroUpdate) => {

                        if (err) {

                            return res.status(500).send({
                                status: 'error',
                                message: 'error en la peticion'

                            });

                        }
                        if (!carroUpdate) {
                            return res.status(404).send({
                                status: 'error',
                                message: 'No se ha atualizado el carro'

                            });


                        }
                        // devolver respuesta
                        return res.status(200).send({
                            status: 'successs',
                            carroUpdate

                        });
                    });
        
                }
    
            });    
    },


};

module.exports = controller;
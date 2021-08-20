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
            var validate_product = !validator.isEmpty(params.product);
            var validate_cantidad = !validator.isEmpty(params.cantidad);

        } catch (err) {
            return res.status(200).send({
                message: "Faltan datos por enviar"+err
            });

        }
        if (validate_product && validate_cantidad) {

            //crear objeto de carrito

            var carrito = new Carrito()

            // asignar valores al product
            carrito.user = req.user.sub;
            carrito.products = params.product;
            carrito.cantidad = params.cantidad;
            carrito.entregado = false;
    

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
            return res.status(200).send({
                message: "Validacion de datos incorrecta, intentelo nuevamente"

            });
        }

    },

    getCarritoByUser: function (req, res) {

        // find 
        Carrito.find({
            user: req.user.sub,
            entregado: false
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
            //sacar el id del topic de la url
            var carritoId = req.params.itemId;
    
            // find and delete por topicId y por userId
            Carrito.findOneAndDelete({ _id: carritoId }, (err, productRemoved) => {
    
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'error en la peticion'
    
                    });
                }
                if (!productRemoved) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No se ha eliminado el product'
                    });
                }
    
                // devolver respuesta
    
                return res.status(200).send({
                    status: 'successs',
                    productRemoved
    
                });
            });
    
    },

    getCarritos: function (req, res) {

        // find 
        Carrito.find({
            // entregado: false
        }).populate('products').populate('user').exec((err, carrito) => {
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

    getCarritoAdmin: function (req, res) {
        var user = req.params.user;

        // find 
        Carrito.find({
            user: user,
            entregado: false
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

    cambiarEstado: function (req, res) {
        var user = req.params.user;

        // find 
        Carrito.findOne({
            _id: user,
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
            carrito.entregado = true;
            carrito.save();
            // devolver resultado 

            return res.status(200).send({
                status: 'success',
                carrito

            });
        });
    },



};

module.exports = controller;
'use strict'

var validator = require('validator');
var Categoria = require('../models/categoria');
// var bcrypt = require('bcrypt-nodejs');
// var jwt = require('../services/jwt')
// var fs = require('fs');
// var path = require('path');

var controller = {

    save: function (req, res) {

        var params = req.body;

        try {
            //validar datos
            var validate_categoria = !validator.isEmpty(params.nombre);

        } catch (err) {
            return res.status(200).send({
                message: "Faltan datos por enviar"
            });

        }
        if (validate_categoria) {

            var categoria = new Categoria();
            categoria.nombre = params.nombre;

            // guardar carrito
            categoria.save((err, categoriaStored) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: "Error al guardar "
                    });

                }
                if (!categoriaStored) {
                    return res.status(500).send({
                        status: 'error',
                        message: "El product no se ha guardado"
                    });
                }
                // devolver respuesta

                return res.status(200).send({ status: 'success', categoriaStored });
            }); // close save

        } else {
            return res.status(200).send({
                message: "Validacion de datos incorrecta, intentelo nuevamente"

            });
        }

    },

    getCategoria: function (req, res) {

        // find 
        Categoria.find().exec((err, categoria) => {        
          
          

            return res.status(200).send({
                status: 'success',
                categoria

            });
        });
    },

    deleteItemCarrito: function (req, res) {
        // sacar el id del topic y del comment de la url
        // var topicId = req.params.topicId;
        var itemId = req.params.itemId;

        //buscar el topic
        Carrito.find({ user: req.user.sub }).exec((err, carrito) => {

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

                const items = carrito[0].products.filter(function (carro) {
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
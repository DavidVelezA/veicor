'use strict'

var validator = require('validator');
var Product = require('../models/product');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt')
var fs = require('fs');
var path = require('path');

var controller = {

    save: function(req, res) {
        //recoger parametros de la peticion
        var params = req.body;

        try {
            //validar datos
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_category = !validator.isEmpty(params.category);
            var validate_price = !validator.isEmpty(params.price);
            var validate_image = !validator.isEmpty(params.image);
            var validate_quantity = !validator.isEmpty(params.quantity);
        } catch (err) {
            return res.status(200).send({
                message: "Faltan datos por enviar"
            });

        }
        if (validate_title && validate_content && validate_category && validate_price && validate_image && validate_quantity) {

            //crear objeto de topic

            var product = new Product();

            // asignar valores al product
            product.title = params.title;
            product.content = params.content;
            product.category = params.category;
            product.price = params.price;
            product.image = params.image;
            product.quantity = params.quantity;



            // guardar usuario
            product.save((err, productStored) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: "Error al guardar "
                    });

                }
                if (!productStored) {
                    return res.status(500).send({
                        status: 'error',
                        message: "El product no se ha guardado"
                    });

                }
                // devolver respuesta

                return res.status(200).send({ status: 'success', productStored });

            }); // close save



        } else {
            return res.status(200).send({
                message: "Validacion de datos incorrecta, intentelo nuevamente"

            });

        }
    },

    getProducts: function(req, res) {
        //cargar la libreria de paginacion en la clase a nivel del modelo

        // recoger la pagina actual
        if (req.params.page == null ||
            req.params.page == undefined ||
            req.params.page == 0 ||
            req.params.page == "0" ||
            !req.params.page) {

            var page = 1;
        } else {
            var page = parseInt(req.params.page);
        }

        // indicar las opcions de paginacion
        /*sort: 
        -1 para ordenas de mas nuevo a mas viejo
        1 para ordenar de mas nuevo a mas nuevo
        populate: 
        */
        var options = {
            sort: { date: -1 },
            limit: 8,
            page: page

        };

        // find paginado
        Product.paginate({}, options, (err, products) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al hacer la consulta'

                });

            }
            if (!products) {
                return res.status(404).send({
                    status: 'notfound',
                    message: 'No hay products que mostrar'

                });

            }
            // devolver resultado (topics, total de topic, total de paginas)

            return res.status(200).send({
                status: 'success',
                products: products.docs,
                totalDocs: products.totalDocs,
                totalPages: products.totalPages

            });
        });
    },
   
    getProduct: function(req, res) {

        var productId = req.params.id;

        Product.findById(productId).exec((err, product) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'error en la peticion'

                });

            }
            if (!product) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el product'

                });

            } else {

                return res.status(200).send({
                    status: 'success',
                    product

                });
            }
        });


    },

    updateProduct: function(req, res) {
        //recoger el id del topic de la url
        var productId = req.params.id;

        // recoger los datos que llegan desde post
        var params = req.body;

        // validar datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_category = !validator.isEmpty(params.category);
            var validate_price = !validator.isEmpty(params.price);
            var validate_image = !validator.isEmpty(params.image);
            var validate_quantity = !validator.isEmpty(params.quantity);
        } catch (err) {
            return res.status(200).send({
                message: "Faltan datos por enviar"
            });

        }
        if (validate_title && validate_content && validate_category && validate_price && validate_image && validate_quantity) {


            //montar un json con los datos modificables

            var update = {
                title: params.title,
                content: params.content,   
                category: params.category,
                price: params.price,
                image: params.image,
                quantity: params.quantity,
            };

            // find and update del topic por id y por id de usuario

            Product.findOneAndUpdate({ _id: productId }, update, { new: true }, (err, ProductUpdate) => {

                if (err) {

                    return res.status(500).send({
                        status: 'error',
                        message: 'error en la peticion'

                    });

                }
                if (!ProductUpdate) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No se ha atualizado el topic'

                    });


                }
                // devolver respuesta
                return res.status(200).send({
                    status: 'success',
                    ProductUpdate

                });
            });

        }


    },

    deleteProduct: function(req, res) {
        //sacar el id del topic de la url
        var productId = req.params.id;

        // find and delete por topicId y por userId
        Product.findOneAndDelete({ _id: productId }, (err, productRemoved) => {

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

    search: function(req, res) {

        // sacar string a buscar de la url
        var searchString = req.params.search;

        // find or
        Product.find({
            "$or": [
                { "title": { "$regex": searchString, "$options": "i" } },
                { "content": { "$regex": searchString, "$options": "i" } },
                { "category": { "$regex": searchString, "$options": "i" } },


            ]
        }).exec((err, products) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'error en la peticion'

                });
            }
            if (!products) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay products diponibles'
                });
            }
            //devolver resultado
            return res.status(200).send({
                status: 'success',
                products
            });


        });





    },

    uploadImg: function(req, res) {

        // configurar modulo multiparty routes/user.controller.js
        // recoger el fichero de la peticion 
        var file_name = 'Imagen no subida';

        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name,

            });
        }

        //conseguir el nombre y la extension del archivo subido
        var file_path = req.files.file0.path;
        // se separa la ruta por segmentos
        var file_split = file_path.split('\\');
        //  para mac linux var file_split = file_path.split('/');

        var file_name = file_split[2];

        // sacar extension del archivo
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        // comprobar extension (solo imagenes) si no es imagen eliminarlo
        if (file_ext != 'png' &&
            file_ext != 'jpg' &&
            file_ext != 'jpeg' &&
            file_ext != 'gif') {
            fs.unlink(file_path, (err) => {

                return res.status(200).send({
                    status: 'error',
                    message: 'la extension del archivo no es valida'
    
                });

            });

        } else {
                // devolver respuesta
                return res.status(200).send({
                    status: 'success',
                    file: file_name
                }); 
           
                              

        }
    },

    getImage: function(req, res) {

        var fileName = req.params.fileName;
        var pathFile = './uploads/products/' + fileName

        // comprobar si existe el fichero

        fs.exists(pathFile, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(pathFile));
            } else {
                return res.status(404).send({
                    message: 'la imagen no existe'

                });

            }

        });


    },

};

module.exports = controller;
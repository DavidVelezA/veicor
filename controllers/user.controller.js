'use strict'
var validator = require('validator');
var User = require('../models/user');
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
            var validate_name = !validator.isEmpty(params.name);
            var validate_cellphone = !validator.isEmpty(params.cellphone);
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password = !validator.isEmpty(params.password);
        } catch (err) {
            return res.status(200).send({
                message: "Faltan datos por enviar"
            });

        }
      //  if (validate_name && validate_surname && validate_email && validate_password) {
            if (validate_name && validate_cellphone && validate_email && validate_password) {

            //crear objeto de usuario

            var user = new User();

            // asignar valores al usuario
            user.name = params.name;
            user.cellphone = params.cellphone;
            user.email = params.email.toLowerCase();
            user.role = 'ROLE_USER';


            // comprobar si el usuario existe
            User.findOne({ email: user.email }, (err, issetUser) => {
                if (err) {
                    return res.status(500).send({
                        message: "Error al comprobar la duplicidad del usuario"
                    });
                }
                if (!issetUser) {

                    // si no existe cifrar la contraseña
                    bcrypt.hash(params.password, null, null, (err, hash) => {
                        user.password = hash;

                        // guardar usuario
                        user.save((err, userStored) => {
                            if (err) {
                                return res.status(500).send({
                                    message: "Error al guardar el usuario"
                                });

                            }
                            if (!userStored) {
                                return res.status(500).send({
                                    message: "El usuario no se ha guardado"
                                });

                            }
                            // devolver respuesta

                            return res.status(200).send({ status: 'success', user: userStored });

                        }); // close save
                    }); //close bcrypt

                } else {
                    return res.status(200).send({
                        message: "El usuario ya existe"
                    });

                }
            });

        } else {
            return res.status(200).send({
                message: "Validacion de datos incorrecta, intentelo nuevamente"

            });

        }
    },
    login: function(req, res) {
        //recoger parametros de la peticion 
        var params = req.body;
        try {
            // validar los datos 
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password = !validator.isEmpty(params.password);
        } catch (err) {
            return res.status(200).send({
                message: "Faltan datos por enviar"
            });
        }
        if (!validate_email || !validate_password) {

            return res.status(200).send({
                message: "Datos incorrectos"

            });
        }

        // buscar usuarios que coincidan con el email
        User.findOne({ email: params.email.toLowerCase() }, (err, user) => {
            if (err) {
                return res.status(500).send({
                    message: "Error al intentar identificarse"

                });

            }
            if (!user) {
                return res.status(404).send({
                    message: "El usuario no existe"

                });

            }

            //si lo encuentra
            // comprobar la contaseña (coincidencia de email y password / bcrypt)
            bcrypt.compare(params.password, user.password, (err, check) => {

                // si es correcto
                if (check) {

                    //generar token de jwt y devolverlo 
                    if (params.gettoken) {
                        return res.status(200).send({
                            token: jwt.createToken(user)

                        });

                    } else {

                        //limpiar objeto antes de devolverlo
                        user.password = undefined;

                        //devolver los datos

                        return res.status(200).send({
                            status: "success",
                            user

                        });
                    }

                } else {
                    return res.status(200).send({
                        message: "Las credenciales no son correctas"

                    });

                }

            });
        });

    },
    
    getUsers: function(req, res) {
        User.find().exec((err, users) => {
            if (err || !users) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay usuarios que mostrar'

                });

            }
            return res.status(200).send({
                status: 'success',
                users: users

            });

        });

    },
    getUser: function(req, res) {
        var userId = req.params.userId;

        User.findById(userId).exec((err, user) => {
            if (err || !user) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el usuario'

                });

            }
            return res.status(200).send({
                status: 'success',
                user: user

            });
        });


    }


};

module.exports = controller;
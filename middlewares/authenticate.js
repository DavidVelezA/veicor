'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = "clave-secreta-para-generar-el-token-9999";

// los middleware tienen 3 parametros
exports.authenticated = function(req, res, next) {

    // comprobar su llega autorizacion 
    if (!req.headers.authorization) {
        return res.status(403).send({
            message: "La peticion no tiene la cabecera de authorization"

        });

    }

    // limpiar el token y quitar comillas
    var token = req.headers.authorization.replace(/['"]+/g, '');


    //console.log(jwt.decode(token, secret));

    try {
        // decodificar token
        var payload = jwt.decode(token, secret);


        // comprobar si el token ha expirado
        if (payload.exp <= moment().unix()) {

            return res.status(404).send({
                message: "El token ha expirado"

            });

        }

    } catch (ex) {
        return res.status(404).send({
            message: "El token no es valido"

        });

    }


    // adjuntar usuario identificado a request
    req.user = payload;

    // pasar a la accion 


    next();

}
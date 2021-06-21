'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = "clave-secreta-para-generar-el-token-9999";

exports.createToken = function(user) {
    // payload es el objeto que se va a usar para generar el token
    var payload = {
        sub: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        cellphone: user.cellphone,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    }

    return jwt.encode(payload, secret)
}
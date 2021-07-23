'use strict'

var express = require('express');
var UserController = require('../controllers/user.controller');

var router = express.Router();
var md_auth = require('../middlewares/authenticate');



// rutas de usuarios api
router.post('/register', UserController.save);
router.post('/login', UserController.login);
router.get('/users',  UserController.getUsers);
router.get('/user/:userId', md_auth.authenticated, UserController.getUser);





module.exports = router;
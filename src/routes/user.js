const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { verifyAccessToken } = require('../helpers/jwt_helper');

router.get('/', userController.getAllUsers);

router.put('/edit' ,verifyAccessToken , userController.editUser);

router.delete('/delete/:id', userController.userdelById);

module.exports = router;
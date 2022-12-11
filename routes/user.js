const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController');
const { validateJWT } = require('../middleware/validateJWT');

router.get('/', validateJWT ,userController.getUsers);

router.get('/level/:level', validateJWT ,userController.getUsersByLevel);

router.get('/:id', validateJWT ,userController.getUserById);

router.post('/',userController.createUser);

router.put('/:id', validateJWT ,userController.updateUser);

router.delete('/:id', validateJWT ,userController.deleteUser); //Solo administrador

router.post('/addFriend/:id', validateJWT ,userController.addFriend)

module.exports = router;

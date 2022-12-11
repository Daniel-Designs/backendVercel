const express = require('express')
const router = express.Router();
const chatController = require('../controllers/chatController');
const { validateJWT } = require('../middleware/validateJWT');

router.get('/', validateJWT ,chatController.getChats);

router.get('/mychats', validateJWT ,chatController.myChats);

router.get('/:id', validateJWT ,chatController.getChatById);

router.post('/',validateJWT ,chatController.createChat);

router.put('/:id', validateJWT ,chatController.updateChat);

router.delete('/:id', validateJWT ,chatController.deleteChat);




module.exports = router;
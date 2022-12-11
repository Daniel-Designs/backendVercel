const {express, Router} = require('express');

const { validateJWT } = require('../middleware/validateJWT');
const messagesController = require('../controllers/messageController')

const router = Router();

router.post('/channelMessages',validateJWT, messagesController.getChannelMessages);
router.post('/lastmsg',validateJWT, messagesController.getLasMessages);
router.post('/read',validateJWT,messagesController.readMessage)
router.delete('/delete',validateJWT,messagesController.deleteMessage)

module.exports = router;
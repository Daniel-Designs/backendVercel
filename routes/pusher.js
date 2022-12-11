const {express, Router} = require('express');

const { validateJWT } = require('../middleware/validateJWT');
const pusherController = require('../controllers/pusherController')

const router = Router();

router.post('/message',validateJWT,pusherController.sendMessage);

router.post("/auth", validateJWT ,pusherController.authUser);

module.exports = router;
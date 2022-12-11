const express = require("express");
const router = express.Router();
const {login,token} = require('../controllers/authAdminController');


router.post('/', login);

router.get('/token', token);

module.exports = router;


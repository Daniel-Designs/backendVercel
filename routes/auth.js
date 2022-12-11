const {login,token} = require('../controllers/authController');
const {Router} = require('express');

const router = Router();

router.post('/', login);
router.get('/token', token);

module.exports = router;


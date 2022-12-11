const express = require('express')
const router = express.Router();
const adminController = require('../controllers/adminController');
const { validateJWT } = require('../middleware/validateJWT');

router.get('/',validateJWT , adminController.getAdmins); //solo admin

router.get('/:id',validateJWT , adminController.getAdminById); //solo admin

router.post('/',validateJWT , adminController.createAdmin); //solo admin

router.put('/:id',validateJWT , adminController.updateAdmin); //solo admin

router.delete('/:id',validateJWT ,adminController.deleteAdmin); //solo admin

module.exports = router;
const express = require('express')
const router = express.Router();
const noteController = require('../controllers/noteController');
const { validateJWT } = require('../middleware/validateJWT');

router.get('/user/:user',validateJWT , noteController.getNotesByUser); //Todos los que tengan token

router.get('/labels',validateJWT,noteController.labels);

router.get('/:id',validateJWT , noteController.getnoteById);

router.post('/', validateJWT ,noteController.createnote);

router.put('/:id',validateJWT , noteController.updatenote);

router.delete('/:id',validateJWT , noteController.deletenote);

module.exports = router;


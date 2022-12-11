const express = require("express");
const router = express.Router();
const exerciseController = require("../controllers/exerciseController");
const { validateJWT } = require("../middleware/validateJWT");
const mimeTypes = require ('mime-types');
const multer = require('multer')


const storage = multer.diskStorage({
    destination:  'media/exerciseAudios',
    filename: (req,file,cb) => {
        cb('',file.originalname)
    }
}) 

const upload = multer({
    storage:storage
})

router.get('/',validateJWT , exerciseController.getExercises); //Todos los que tengan token


router.get('/info',validateJWT,exerciseController.info);

router.get('/level/:level',validateJWT , exerciseController.getExercisesByLevel); //Todos los que tengan token

router.get('/:id', validateJWT ,exerciseController.getExerciseById); //Todos los que tengan token

router.post('/', validateJWT, upload.single("file") ,exerciseController.createExercise); //Solo Admin

router.put('/:id',validateJWT , exerciseController.updateExercise); //Solo Admin

router.delete('/:id',validateJWT , exerciseController.deleteExercise); //Solo Admin

router.post ('/soloDoc',upload.single('file'),(req, res)=>{
    console.log('esto es lo que llega: ', req.body);
    return res.send('ok')
})   

module.exports = router;
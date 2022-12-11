const express = require("express");
const router = express.Router();
const exerciseResultController = require("../controllers/exerciseResultController");
const { validateJWT } = require("../middleware/validateJWT");

router.get("/", exerciseResultController.getExerciseResults); //Todos los que tengan token

router.get(
  "/:iduser&:idexercise",
  exerciseResultController.getExerciseResultById
); //Todos los que tengan token

router.post("/", exerciseResultController.createExerciseResult);

router.put(
  "/:iduser&:idexercise",
  exerciseResultController.updateExerciseResult
); //Solo Admin

router.delete(
  "/:iduser&:idexercise",
  exerciseResultController.deleteExerciseResult
); //Solo Admin

module.exports = router;

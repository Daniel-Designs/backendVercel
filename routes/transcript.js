const express = require("express");
const router = express.Router();
const transcriptController = require("../controllers/transcriptController");

router.post("/start/:containerName", transcriptController.startTranscript);

router.post(
  "/speaking/:containerName",
  transcriptController.startTranscriptSpeaking
);

router.get("/:callID/:userID", transcriptController.getTranscriptByCall);

router.get(
  "/exercises/:exID/:userID",
  transcriptController.getTranscriptByExercise
);

module.exports = router;

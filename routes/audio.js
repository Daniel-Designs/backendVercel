const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/examAudios/:id", (req, res) => {
  res.sendFile("./" + req.params.id, {
    root: path.join(__dirname, "../media/examAudios/"),
  });
});

module.exports = router;

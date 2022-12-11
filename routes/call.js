const { Router } = require("express");
const router = Router();
const callController = require("../controllers/callerController");
const { validateJWT } = require("../middleware/validateJWT");

router.get("/", callController.getCalls);

router.get("/myCalls/:userID", callController.getMyCalls);

router.get("/:idcall", callController.getCallByID);

router.post("/:receiverID", callController.callUser);

router.put("/:idcall", callController.endCall);

module.exports = router;

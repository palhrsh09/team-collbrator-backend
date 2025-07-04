const router = require("express").Router();
const messageController = require("../controllers/message.controller");

router.get("/", messageController.getAll);
router.get("/:id", messageController.getById);
router.post("/", messageController.create);
router.put("/:id", messageController.update);
router.delete("/:id", messageController.delete);
router.patch("/:id", messageController.restore);

module.exports = router;

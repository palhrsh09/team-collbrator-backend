const router = require("express").Router();
const taskController = require("../controllers/task.controller");

router.get("/", taskController.getAll);
router.get("/:id", taskController.getById);
router.post("/", taskController.create);
router.put("/:id", taskController.update);
router.delete("/:id", taskController.delete);
router.patch("/:id", taskController.restore);

module.exports = router;

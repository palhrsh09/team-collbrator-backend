const router = require("express").Router();
const projectController = require("../controllers/project.controller");

router.get("/", projectController.getAll);
router.get("/:id", projectController.getById);
router.post("/", projectController.create);
router.put("/:id", projectController.update);
router.delete("/:id", projectController.delete);
router.patch("/:id", projectController.restore);

module.exports = router;

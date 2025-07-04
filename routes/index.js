const { verifyToken } = require("../middleware/index.js");


module.exports = (app, express) => {
  const router = express.Router();

  router.use("/v1", require("./allowed.route.js"));
  router.use("/v1/users", verifyToken, require("./users.routes.js"));
  router.use("/v1/project", verifyToken, require("./project.route.js"));
  router.use("/v1/team", verifyToken, require("./team.route.js"));
  router.use("/v1/task", verifyToken, require("./task.route.js"));
  app.use("/api", router);
};
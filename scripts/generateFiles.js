const fs = require("fs");
const path = require("path");

const ensureDirectoryExistence = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const createFileIfNotExists = (dir, fileName, content) => {
  ensureDirectoryExistence(dir);
  const filePath = path.join(dir, fileName);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`Created ${filePath}`);
  } else {
    console.log(`${filePath} already exists`);
  }
};

const snakeToCamelCase = (snake_case) => {
  return snake_case
    .toLowerCase()
    .split("_")
    .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join("");
};

const snakeToPascalCase = (snake_case) => {
  return snake_case
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
};

const getTemplate = (type, tableName) => {
  const tableNameCC = snakeToCamelCase(tableName);
  const tableNamePC = snakeToPascalCase(tableName);
  const tableNameLC = tableName.toLowerCase();
  
  switch (type) {
    case "route":
      return `const router = require("express").Router();
const ${tableNameCC}Controller = require("../controllers/${tableNameLC}.controller");

router.get("/", ${tableNameCC}Controller.getAll);
router.get("/:id", ${tableNameCC}Controller.getById);
router.post("/", ${tableNameCC}Controller.create);
router.put("/:id", ${tableNameCC}Controller.update);
router.delete("/:id", ${tableNameCC}Controller.delete);
router.patch("/:id", ${tableNameCC}Controller.restore);

module.exports = router;
`;

    case "controller":
      return `const ${tableNameCC}Service = require("../services/${tableNameLC}.service");

exports.getAll = async (req, res) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      sortBy: req.query.sortBy || "createdAt",
      sortOrder: req.query.sortOrder || "desc",
      search: req.query.search || "",
      includeDeleted: req.query.includeDeleted === "true",
    };

    const result = await ${tableNameCC}Service.getAll(options);
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error("Error in getAll:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await ${tableNameCC}Service.getById(req.params.id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "${tableNamePC} not found"
      });
    }
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error("Error in getById:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await ${tableNameCC}Service.create(req.body);
    res.status(201).json({
      success: true,
      data,
      message: "${tableNamePC} created successfully"
    });
  } catch (error) {
    console.error("Error in create:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await ${tableNameCC}Service.update(req.params.id, req.body);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "${tableNamePC} not found"
      });
    }
    res.status(200).json({
      success: true,
      data,
      message: "${tableNamePC} updated successfully"
    });
  } catch (error) {
    console.error("Error in update:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const force = req.query.force === "true";
    const result = await ${tableNameCC}Service.delete(req.params.id, force);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "${tableNamePC} not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: force ? "${tableNamePC} permanently deleted" : "${tableNamePC} deleted successfully"
    });
  } catch (error) {
    console.error("Error in delete:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.restore = async (req, res) => {
  try {
    const data = await ${tableNameCC}Service.restore(req.params.id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "${tableNamePC} not found"
      });
    }
    res.status(200).json({
      success: true,
      data,
      message: "${tableNamePC} restored successfully"
    });
  } catch (error) {
    console.error("Error in restore:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};`;

    case "service":
      return `const ${tableNamePC} = require("../models/${tableNameLC}.model");

class ${tableNamePC}Service {
  async getAll(options) {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      search = "",
      includeDeleted = false
    } = options;

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    // Build search query
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } }
        ]
      };
    }

    // Handle soft delete
    if (!includeDeleted) {
      query.deletedAt = { $exists: false };
    }

    const [data, total] = await Promise.all([
      ${tableNamePC}.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      ${tableNamePC}.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  }

  async getById(id) {
    return await ${tableNamePC}.findById(id).lean();
  }

  async create(data) {
    const ${tableNameLC} = new ${tableNamePC}(data);
    return await ${tableNameLC}.save();
  }

  async update(id, data) {
    return await ${tableNamePC}.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();
  }

  async delete(id, force = false) {
    if (force) {
      return await ${tableNamePC}.findByIdAndDelete(id);
    } else {
      return await ${tableNamePC}.findByIdAndUpdate(
        id,
        { deletedAt: new Date() },
        { new: true }
      );
    }
  }

  async restore(id) {
    return await ${tableNamePC}.findByIdAndUpdate(
      id,
      { $unset: { deletedAt: 1 } },
      { new: true }
    );
  }
}

module.exports = new ${tableNamePC}Service();`;

    case "model":
      return `const mongoose = require("mongoose");

const ${tableNameLC}Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    status: {
      type: Boolean,
      default: true
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Indexes
${tableNameLC}Schema.index({ name: 1 });
${tableNameLC}Schema.index({ status: 1 });
${tableNameLC}Schema.index({ deletedAt: 1 });
${tableNameLC}Schema.index({ createdAt: -1 });

// Virtual for id
${tableNameLC}Schema.virtual("id").get(function () {
  return this._id.toHexString();
});

${tableNameLC}Schema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    return ret;
  }
});

// Pre-save middleware
${tableNameLC}Schema.pre("save", function (next) {
  if (this.isNew) {
    this.createdAt = new Date();
  }
  this.updatedAt = new Date();
  next();
});

// Static methods
${tableNameLC}Schema.statics.findActive = function () {
  return this.find({ status: true, deletedAt: { $exists: false } });
};

${tableNameLC}Schema.statics.findDeleted = function () {
  return this.find({ deletedAt: { $exists: true } });
};

// Instance methods
${tableNameLC}Schema.methods.softDelete = function () {
  this.deletedAt = new Date();
  return this.save();
};

${tableNameLC}Schema.methods.restore = function () {
  this.deletedAt = undefined;
  return this.save();
};

module.exports = mongoose.model("${tableNamePC}", ${tableNameLC}Schema);`;

    default:
      return "";
  }
};

const getDefaultTemplate = (fileType) => {
  switch (fileType) {
    case "server":
      return `const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

const { NODE_ENV, PORT, MONGODB_URI, CORS_URLS } = process.env;

if (NODE_ENV === "local") {
  require("dotenv").config({ path: \`.env.local\`, override: true });
}

const app = express();

// CORS configuration
const whitelist = CORS_URLS ? CORS_URLS.split(",") : [];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) > -1 || NODE_ENV === "development" || NODE_ENV === "local") {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB connected successfully");
})
.catch((error) => {
  console.error("❌ MongoDB connection error:", error);
  process.exit(1);
});

// Routes
require("./routes")(app, express);

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error handler:", error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error"
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Start server
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});
`;

    case "database":
      return `const mongoose = require("mongoose");

// Connection event handlers
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("Mongoose connection closed through app termination");
  process.exit(0);
});

module.exports = mongoose;
`;

    case "routes":
      return `const { verifyToken } = require("../middleware/auth");

module.exports = (app, express) => {
  // Health check
  app.get("/health", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Server is running",
      timestamp: new Date().toISOString()
    });
  });

  // API routes
  const router = express.Router();
  
  // Add your routes here
  // router.use("/users", require("./users.route"));
  // router.use("/auth", require("./auth.route"));
  
  // Protected routes (uncomment when you have auth middleware)
  // app.use("/api", verifyToken, router);
  app.use("/api", router);
  
  // Public routes
  app.use("/public", express.Router());
};
`;

    default:
      return "";
  }
};

const generateDefaultFiles = () => {
  const defaultFiles = [
    { dir: path.join(__dirname, "../server"), fileName: "index.js", type: "server" },
    { dir: path.join(__dirname, "../config"), fileName: "database.js", type: "database" },
    { dir: path.join(__dirname, "../routes"), fileName: "index.js", type: "routes" },
  ];

  defaultFiles.forEach(({ dir, fileName, type }) => {
    const content = getDefaultTemplate(type);
    createFileIfNotExists(dir, fileName, content);
  });
};

const generateFiles = (tableName) => {
  generateDefaultFiles();
  const types = ["controller", "model", "route", "service"];
  
  types.forEach((type) => {
    const dir = path.join(__dirname, "../" + type + "s");
    const fileName = `${tableName}.${type}.js`;
    const content = getTemplate(type, tableName);
    createFileIfNotExists(dir, fileName, content);
  });
  
  console.log(`\n✅ Generated files for: ${tableName}`);
  console.log("📁 Files created:");
  console.log(`   - controllers/${tableName}.controller.js`);
  console.log(`   - models/${tableName}.model.js`);
  console.log(`   - routes/${tableName}.route.js`);
  console.log(`   - services/${tableName}.service.js`);
  console.log("\n🔧 Don't forget to:");
  console.log(`   1. Add the route to routes/index.js`);
  console.log(`   2. Update the model schema as needed`);
  console.log(`   3. Configure your MongoDB connection`);
};

const tableName = process.argv[2] || "users";
generateFiles(tableName);
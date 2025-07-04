const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Project", ProjectSchema);

const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Team", TeamSchema);    
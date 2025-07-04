const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  timestamp: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model("Message", MessageSchema);

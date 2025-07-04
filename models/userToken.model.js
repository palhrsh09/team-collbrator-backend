const mongoose = require("mongoose");

const UserTokenSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tokenSignature: { type: String, required: true },
    expiredAt: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserToken", UserTokenSchema);

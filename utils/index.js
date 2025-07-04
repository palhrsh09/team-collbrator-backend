const crypto = require("crypto");

exports.hashText = async (text) => {
  return crypto.createHash("sha256").update(text).digest("hex");
};
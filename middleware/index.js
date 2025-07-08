const jwt = require("jsonwebtoken");
const db = require("../models");
const UserToken = db.userToken;
const { hashText } = require("../utils");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token in cookies" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.userId) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    const tokenSignature = await hashText(token.split(".")[2]);
    const userToken = await UserToken.findOne({ userId: decoded.userId });

    if (!userToken) {
      return res.status(401).json({ error: "Invalid session" });
    }

    if (userToken.tokenSignature !== tokenSignature) {
      return res.status(401).json({ error: "Token signature mismatch" });
    }

    if (userToken.expiredAt && new Date() > userToken.expiredAt) {
      return res.status(401).json({ error: "Token expired" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = {
  verifyToken,
};

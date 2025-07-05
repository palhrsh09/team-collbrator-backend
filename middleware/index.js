const jwt = require("jsonwebtoken");
const firebaseAdmin = require('firebase-admin');
const db = require("../models");
const UserToken = db.userToken;
const { hashText } = require("../utils");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1] || req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const tokenSignature = await hashText(token.split('.')[2]);
    const userToken = await UserToken.findOne({ userId: decoded.userId });
    if (!userToken) return res.status(401).json({ error: 'Invalid session' });

    if (tokenSignature !== userToken.tokenSignature)
      return res.status(401).json({ error: 'Token signature mismatch' });

    if (userToken.expiredAt < new Date()) return res.status(401).json({ error: 'Token expired' });

    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = {
    verifyToken,
};

const jwt = require("jsonwebtoken");
const firebaseAdmin = require('firebase-admin');
const db = require("../models");
const UserToken = db.userToken;
const { hashText } = require("../utils");
// const rbac = require('../config/rbac.config');

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1] || req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    // if (req.path === '/api/v1/login' || req.path === '/api/v1/signup') {
    //   const decoded = await firebaseAdmin.auth().verifyIdToken(token);
    //   req.user = { firebaseUid: decoded.uid, email: decoded.email };
    //   return next();
    // }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const tokenSignature = await hashText(token.split('.')[2]);
    console.log("decoded",decoded)
    const userToken = await UserToken.findOne({ userId: decoded.userId });
    if (!userToken) return res.status(401).json({ error: 'Invalid session' });

    if (tokenSignature !== userToken.tokenSignature)
      return res.status(401).json({ error: 'Token signature mismatch' });

    if (userToken.expiredAt < new Date()) return res.status(401).json({ error: 'Token expired' });

    req.user = decoded;
    next();
  } catch (err) {
    console.log("middleware error",err)
    console.error('Token verification error:', err);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

// const rbacValidation = async (req, res, next) => { 
//   try {
//       const role = req.user.role
//       const permissions = rbac[role]?.routes || [];
//       const requestPath = req.baseUrl.replace('/api', '');
//       const requestMethod = req.method;

//     const isAllowed = permissions.some(route => {
//       return (
//         requestPath.startsWith(route.path) &&
//         route.methods.includes(requestMethod)
//       );
//     });

//     if (!isAllowed) {
//       return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
//     }

//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token.' });
//   }
// }

module.exports = {
    verifyToken,
    // rbacValidation
};

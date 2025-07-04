const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models");
const { hashText } = require("../utils");
const firebaseAdmin = require("../config/fireBaseAdmin.config")

const User = db.user;
const Role = db.role;
const UserToken = db.userToken


const generateJwtToken = async (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role,
    teamId: user.teamId
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
  const tokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const tokenSignature = await hashText(token.split('.')[2]);

  await UserToken.findOneAndUpdate(
    { userId: user._id },
    {
      userId: user._id,
      tokenSignature,
      expiredAt: tokenExpiresAt,
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  return token;
};


const registerUser = async ({ name, email, firebaseUid, role, teamId }) => {
  const allowedRoles = ['MEMBER', 'MANAGER',"ADMIN"];
  const selectedRole = role && allowedRoles.includes(role.toUpperCase()) ? role.toUpperCase() : 'MEMBER';

  const existingUser = await User.findOne({ $or: [{ email }, { firebaseUid }] });
  if (existingUser) throw new Error('User already exists');

  const newUser = new User({
    name,
    email,
    password: firebaseUid, 
    role: selectedRole,
    teamId: teamId || null,
  });

  await newUser.save();
  await firebaseAdmin.auth().setCustomUserClaims(firebaseUid, { role: selectedRole });

  const token = await generateJwtToken(newUser);

  return { user: newUser, token };
};

const loginUser = async ({ email, firebaseUid }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  const isMatch = await user.comparePassword(firebaseUid);
  if (!isMatch) throw new Error('Invalid Firebase credentials');

  const token = await generateJwtToken(user);

  return { user, token };
};


module.exports = { registerUser, loginUser };

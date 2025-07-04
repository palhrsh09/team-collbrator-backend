const userService = require("../services/auth.service");

const register = async (req, res) => {
  try {
    const { name, email, firebaseUid,role ,teamId} = req.body;
    const user = await userService.registerUser({ name, email, firebaseUid,role, teamId});
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, firebaseUid } = req.body;
    const { user, token } = await userService.loginUser({ email, firebaseUid });
   console.log("token",token)
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          teamId: user.teamId,
          token: token
        },
      });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};


const  getAllusers = async (req, res) => {
  try {
    const users = await userService.getAllusers();
    res.status(200).json(users);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// GET /api/users/:id
const  getusersById = async (req, res) => {
  try {
    const user = await userService.getusersById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
      console.log(error)
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

module.exports = { register, login,getAllusers,getusersById};
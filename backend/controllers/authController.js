const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  // console.log("Request Body:", req.body);
  // console.log("Email:", email);
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // TODOS: hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hashedPassword });
    // TODOS: otp sending
    if (user) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const message = `Welcome to ShopNest, ${name}! 
        Your OTP for ShopNest registration is: ${otp}`;

      // TODOS: welcome mail
      sendEmail(
        email,
        "Welcome to ShopNest - Your OTP for Registration",
        message,
      );

      // TODOS: implement jwt token
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  } catch (error) {
  console.log(error);
  return res.status(500).json({
    message: error.message,
  });
}
};

//Login user

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUsers,
};

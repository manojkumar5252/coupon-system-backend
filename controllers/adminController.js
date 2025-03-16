const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerAdmin = async (req, res) => {
  try {
    let { username, password } = req.body;

    username = username.trim();
    password = password.trim();

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("👉 Hashed password:", hashedPassword);

    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();

    console.log("✅ Admin registered successfully");
    res.status(201).json({ message: "Admin registered successfully" });

  } catch (error) {
    console.error("❌ Error in registration:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.loginAdmin = async (req, res) => {
  try {
    let { username, password } = req.body;

    username = username.trim();
    password = password.trim();

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    console.log("👉 Password sent by user:", password);
    console.log("👉 Hashed password from DB:", admin.password);

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("👉 Password match result:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });

  } catch (error) {
    console.error("❌ Error in login:", error);
    res.status(500).json({ message: error.message });
  }
};

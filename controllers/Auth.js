// controllers/authController.js

const User = require("../models/User");
const Profile = require("../models/Profile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
  console.log("✅ Parsed req.body:", req.body);

  try {
    const { userName, fullName, email, password } = req.body;
    if (!userName || !fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all details carefully"
      });
    }

    if (await User.findOne({ userName })) {
      return res.status(409).json({
        success: false,
        message: "User already exists! Please login."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const additionalDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      mobileNumber: null
    });

    const user = await User.create({
      userName,
      fullName,
      email,
      password: hashedPassword,
      additionDetails: additionalDetails._id,
      image: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`
    });

    additionalDetails.user = user._id;
    await additionalDetails.save();

    user.password = undefined; // remove password from output

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user
    });
  } catch (error) {
    console.error("❌ signUp error:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while signing up",
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  console.log("✅ Parsed req.body:", req.body);

  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in both username and password"
      });
    }

    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found! Please sign up first."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({
        success: false,
        message: "Password does not match."
      });
    }

    const payload = {
      username: user.userName,
      id: user._id,
      additionDetails: user.additionDetails
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "5h"
    });

    user.password = undefined; // hide password
    user.token = token;

    res
      .cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      })
      .status(200)
      .json({
        success: true,
        message: "User logged in successfully",
        token,
        user
      });
  } catch (error) {
    console.error("❌ login error:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred during login",
      error: error.message
    });
  }
};

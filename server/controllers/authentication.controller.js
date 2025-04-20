//  Todo
//  1. Send otp
//  2. Signup
//  3. Login
//  4.Change password

import User from "../models/user.model.js";
import OTP from "../models/otp.model.js";
import chalk from "chalk";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";
import Profile from "../models/profile.model.js";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

//  1. Send otp
// email from req.body , check user already exists?, generate otp, unique otp, save otp in db (otp will automatically expire in 5 minute), send response,

export const sendOtpController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      res.status(409).json({
        success: false,
        message: "Please Enter Email",
        error: "Please Enter Email",
      });
    const userExists = await User.findOne({ email });
    if (userExists)
      res.status(409).json({
        success: false,
        message: "User already exists",
        error: "User already exists",
      });
    // generate otp
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("Otp Generated ---> ", otp);
    let otpExists = OTP.findOne({ otp: otp });
    // the otp-generator package doesn't create unique alltime, later we will use a package that will create only unique otp
    while (otpExists) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      otpExists = OTP.findOne({ otp: otp });
    }
    //save otp in db, collection OTP
    let otpresponse = await OTP.create({
      email,
      otp,
    });
    console.log("Otp response ---> ", otpresponse);
    return res
      .status(200)
      .json({ success: true, message: "Otp sent successfully", otp });
  } catch (error) {
    console.log(
      chalk.bgRedBright(
        "Error in sendOtpController function in authentication.controller.js --->> ",
        error.message
      )
    );
    return res.status(503).json({
      success: false,
      message: "Internal Server Error",
      error: "Internal Server Error",
    });
  }
};

//  2. Signup
//     requiredfields => firstName, lastName, email,
//      password, accountType, additionalDetails,
//      courses , profilePic, courseProgress

//fetch data from req body, validate data, patch both password and confirm password,
// check user already exists, than find recent otp in OTP collection
// validate otp with entered otp
// hash password, create entry in db, return response
export const signupController = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      additionalDetails,
      profilePic,
      otp,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !additionalDetails ||
      !profilePic ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "Required fields are missing",
        error: "Required fields are missing",
      });
    }
    // match password and confirmPassword
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirmPassword does not match, Try again",
        error: "Passwords do not match",
      });
    }
    const userExists = await User.findOne({ email: email });
    if (userExists)
      return res.status(400).json({
        success: false,
        message: "User already Registered",
        error: "User already Registered",
      });
    // find recent otp
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log("Recent otp is --> ", otp);
    // validate otp
    if (recentOtp.length < 1)
      return res.status(404).json({ success: false, message: "Otp not found" });
    if (otp !== recentOtp)
      return res
        .status(400)
        .json({ success: false, message: "Not a valid otp" });

    //hash the password
    const encryptedPassword = await bcrypt.hash(password, 10);

    const profileDetails = await Profile.create({
      gender: "male",
      dateOfBirth: "dummy:dummy",
      about: "Hello dummy",
      contactNumber: 1234567890,
    });

    const user = {
      firstName,
      lastName,
      email,
      password: encryptedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      profilePic: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    };

    const payload={
        email:user.email,
        id:user._id,
        accountType:user.accountType
      }

    var userToken = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });
    res.cookie("userToken", userToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === "production",
      secure: true,
    });

    return res
      .status(200)
      .json({ success: true, message: "User Registered Successfully", user });
  } catch (error) {
    console.log(
      chalk.bgRedBright(
        "Error in signupController function in authentication.controller.js --->> ",
        error.message
      )
    );
    return res.status(503).json({
      success: false,
      message: "Internal Server Error",
      error: "Internal Server Error",
    });
  }
};

// login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(409).json({
        success: false,
        message: "Required fields are missing",
        error: "Required fields are missing",
      });
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found, please signup",
        error: "User not found, please signup",
      });

    // compare password check for equality password and save password
    const matchPassword = bcrypt.compare(password, user.password);
    if (!matchPassword)
      return res.status(409).json({
        success: false,
        message: "Invalid Credentials",
        error: "Invalid Credentials",
      });

      const payload={
        email:user.email,
        id:user._id,
        accountType:user.accountType
      }

    // jwt token
    var userToken = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });
    user.userToken = userToken;
    res.cookie("userToken", userToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === "production",
      secure: true,
    });
    return res.status(200).json({
      success: true,
      message: "User Logged in Successfully",
      error: "User Logged in Successfully",
      user,
    });
  } catch (error) {
    console.log(
      chalk.bgRedBright(
        "Error in loginController function in authentication.controller.js --->> ",
        error.message
      )
    );
    return res.status(503).json({
      success: false,
      message: "Internal Server Error",
      error: "Internal Server Error",
    });
  }
};

// change password

export const changePasswordController = async (req, res) => {
  try {
    const {userId} = req.user;
    if (!userId)
      return res
        .status(409)
        .json({
          success: false,
          message: "User not authorized",
          error: "User not authorized",
        });

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({
          success: false,
          message: "Unauthorized user",
          error: "Unauthorized user",
        });

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword)
      return res
        .status(409)
        .json({
          success: false,
          message: "New Password and Old Password doesn't match",
          error: "New Password and Old Password doesn't match",
        });
    
        let isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(409).json({success:false, message:'Invalid credentials, please check password'})
        
            let encryptedPassword = await bcrypt.hash(password,10)
            user.password = encryptedPassword
            await user.save()

            return res.status(200).json({success:true, message:'Password Changed Successfully'})
  } catch (error) {
    console.log(
      chalk.bgRedBright(
        "Error in changePasswordController function in authentication.controller.js --->> ",
        error.message
      )
    );
    return res.status(503).json({
      success: false,
      message: "Internal Server Error",
      error: "Internal Server Error",
    });
  }
};

//      🔄 Reset Password
//      Used when?
//      When a user forgets their current password.
//      Flow:
//      Click “Forgot Password”
//      Receive a link via email or SMS
//      Set a new password without entering the old one
//      Security Check:
//      Usually requires email/OTP verification to prove identity.
//      Example Use Case:
//      "I can't log in — I forgot my password."

//  🔧 Change Password
//      Used when?
//      When a user remembers their current password and wants to update it.
//      Flow: Logged-in user goes to profile/settings
//      Enters old password
//      Chooses a new password
//      Security Check:
//      Must confirm current password to proceed.
//      Example Use Case:
//      "I want to update my password for better security."

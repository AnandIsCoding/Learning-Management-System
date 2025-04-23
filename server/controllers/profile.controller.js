import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";

export const updateProfileController = async (req, res) => {
  try {
    const { userId } = req.user;
    if (!userId)
      return res.status(400).json({
        success: false,
        message: "Unauthorized !! no userId found !",
        error: "Unauthorized !! no userId found !",
      });
    const { gender, dateOfBirth, about = "", contactNumber } = req.body;
    if (!gender || !dateOfBirth || !contactNumber) {
      return res.status(409).json({
        success: false,
        message: "Required Field Missing !",
        error: "Required Field Missing !",
      });
    }

    const userDetails = await User.findById(userId);
    const profileId = userDetails.additionalDetails;
    const updatedProfileDetails = await Profile.findByIdAndUpdate(
      profileId,
      { gender, dateOfBirth, about, contactNumber },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully !",
      data: updatedProfileDetails,
    });
  } catch (error) {
    console.log(
      chalk.bgRedBright(
        "Error in updateProfileController function in profile.controller.js --->> ",
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

export const getProfileController = async (req, res) => {
  try {
    const { userId } = req.user;
    if (!userId)
      return res.status(400).json({
        success: false,
        message: "Unauthorized !! no userId found !",
        error: "Unauthorized !! no userId found !",
      });

    const userDetails = await User.findById(userId);
    const profileId = userDetails.additionalDetails;
    if (!profileId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Profile Id not found",
          error: "Profile Id not found",
        });
    }
    const userProfile = await Profile.findOne({ profileId });
    return res
      .status(200)
      .json({
        success: true,
        message: "Profile fetched Successfully !",
        error: "Profile fetched Successfully !",
      });
  } catch (error) {
    console.log(
      chalk.bgRedBright(
        "Error in getProfileController function in profile.controller.js --->> ",
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

export const deleteProfileController = async (req, res) => {
  try {
    const { userId } = req.user;
    if (!userId)
      return res
        .status(409)
        .json({
          success: false,
          message: "Unauthorized, userId not found !",
          error: "Unauthorized, userId not found !",
        });

    // find user
    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res
        .status(404)
        .json({
          success: false,
          message: "User not Found !",
          error: "User not Found !",
        });
    }

    const profileId = userDetails.additionalDetails;
    if (!profileId) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Profile Id not found",
          error: "Profile Id not found",
        });
    }
    await Profile.findByIdAndDelete(profileId);
    // Delete the profile
    const deletedProfile = await Profile.findByIdAndDelete(profileId);
    if (!deletedProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile already deleted or not found!",
        error: "Profile already deleted or not found!",
      });
    }

    // Remove reference from user
    userDetails.additionalDetails = null;
    await userDetails.save();

    return res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
      data: deletedProfile,
    });
  } catch (error) {
    console.log(
      chalk.bgRedBright(
        "Error in deleteProfileController function in profile.controller.js --->> ",
        error.message
      )
    );
    return res.status(503).json({
      success: false,
      message: "Can't Delere Account! Internal Server Error",
      error: "Internal Server Error",
    });
  }
};






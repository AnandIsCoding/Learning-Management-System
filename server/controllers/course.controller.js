import {
  isFileTypeSupported,
  uploadFileToCloudinary,
} from "../utils/helpers.utils";
import User from "../models/user.model.js";
import Category from "../models/category.model.js";
import dotenv from "dotenv";
import Course from "../models/course.model.js";
dotenv.config();
export const createCourseController = async (req, res) => {
  try {
    const { courseName, courseDescription, whatYouWillLearn, price, category , tag} =
      req.body;
    const { userId } = req.user;
    const { thumbnail } = req.files;
    // validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !category ||
      !thumbnail
    ) {
      res
        .status(400)
        .json({
          success: false,
          message: "Required Field Missing !",
          error: "Required Field Missing !",
        });
    }

    // check that user is instructor only
    const instructorDetails = await User.findById(userId);
    if (!userDetails) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Instructor Details not found !",
          error: "Instructor Details not found !",
        });
    }
    console.log("Instructor details --->> ", instructorDetails);

    // check userId and instructor._id are same
    //----------------------------------------------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------------------------------------

    // check if tag is valid, tag is tag _id
    const categoryDetails = Category.findById(category);
    if (!categoryDetails) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Category Details not found",
          error: "Category Details not found",
        });
    }

    // //file validation
    const supportedTypes = ["jpeg", "jpg", "png"];
    const fileType = thumbnail.originalname.split(".").pop().toLowerCase(); // If the filename has multiple dots (my.profile.png), it will correctly extract the last extension.

    // if fileType is not supported
    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "Invalid File type only jpg jpeg and png supported",
        error: "Invalid File type only jpg jpeg and png supported",
      });
    }

    //if file type supported truw than only further code execute
    const thumbnailImage = await uploadFileToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    //create entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      tag,
      category:categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    // add new course to the user schema of instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          course: newCourse._id,
        },
      },
      { new: true }
    );
    await Category.findByIdAndUpdate(
      { _id: categoryDetails._id },
      {
        $push: {
          course: newCourse._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      newCourse,
    });
  } catch (error) {
    console.log(
      chalk.bgRedBright(
        "Error in createCourseController function in course.controller.js --->> ",
        error.message
      )
    );
    return res.status(503).json({
      success: false,
      message: "Failed to create Course!",
      error: "Failed to create Course!",
    });
  }
};


export const getAllCoursesController = async(req,res) =>{
  try {
    const {userId} = req.user
    const allcourses = await Course.find({})
    return res.status(200).json({success:true,message:'All Course Fetched Successfully', allcourses})

  } catch (error) {
    console.log(
      chalk.bgRedBright(
        "Error in getAllCoursesController function in course.controller.js --->> ",
        error.message
      )
    );
    return res.status(503).json({
      success: false,
      message: "Failed to fetch Course!",
      error: "Failed to fetch Course!",
    });
  }
}

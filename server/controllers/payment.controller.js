import chalk from "chalk";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import instance from "../configs/razorpay.config.js";
import courseEnrollmentEmail from "../mail/templates/courseEnrollmentEmail.js";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import mailSender from "../utils/mailSender.utils.js";

// capture the payment and initiate the Razorpay order
export const capturePaymentController = async (req, res) => {
  try {
    // get course and user id
    // validation , check course and user valid
    // is user already buied same course in past
    // create order
    // return response
    const { courseId } = req.body;
    const { userId } = req.user;
    if (!userId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId or userId something missing !",
        error: "courseId or userId something missing !",
      });
    }
    const courseDetails = await Course.findById(courseId);
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: "Course not found !",
        error: "Course not found !",
      });
    }
    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "User not found !",
        error: "User not found !",
      });
    }
    //let user_id_objectIdformat = new mongoose.Types.ObjectId(userDetails._id)

    if (
      courseDetails.studentsEnrolled
        .map((id) => id.toString())
        .includes(userDetails._id.toString())
    ) {
      return res.status(400).json({
        success: false,
        message: "User Already Enrolled !",
        error: "Duplicate enrollment !",
      });
    }

    // create order
    const amount = courseDetails.price;
    const currency = "INR";

    const options = {
      amount: amount * 100,
      currency,
      receipt: `receipt_${uuidv4()}`,
      notes: {
        courseId: courseId,
        userId,
      },
    };

    try {
      // initiate payment using razorpay
      const paymentResponse = await instance.orders.create(options);
      console.log("Payment Response of razorpay ---->> ", paymentResponse);
      return res.status(200).json({
        success: true,
        message: "Payment Initiated Successfully",
        courseName: courseDetails.courseName,
        courseDescription: courseDetails.courseDescription,
        thumbnail: courseDetails.thumbnail,
        orderId: paymentResponse.id,
        currency: paymentResponse.currency,
        amount: paymentResponse.amount,
      });
    } catch (error) {
      console.log(
        chalk.bgRedBright(
          "Error in capturePaymentController function in payment.controller.js during payment initiate--->> ",
          error.message
        )
      );
      return res.status(503).json({
        success: false,
        message: "Failed to Initiate Payment!",
        error: "Failed to Initiate Payment!",
      });
    }
  } catch (error) {
    console.log(
      chalk.bgRedBright(
        "Error in capturePaymentController function in payment.controller.js --->> ",
        error.message
      )
    );
    return res.status(503).json({
      success: false,
      message: "Failed to Capture Payment!",
      error: "Failed to Capture Payment!",
    });
  }
};

const verifySignatureController = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    // Razorpay needs the raw request body for verification
    const body = JSON.stringify(req.body); // or use rawBody if available

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (expectedSignature === signature) {
      // ✅ payment is verified
      console.log("Payment is Authorized !!✅");
      // extract notes (options vala) from req
      const notes = req.body?.payload?.payment?.entity?.notes || {};
      const { courseId, userId } = notes;

      try {
        // fullfill action
        // find course and enroll student in it
        const courseDetails = await Course.findById(courseId);
        if (!courseDetails)
          return res
            .status(400)
            .json({
              success: false,
              message: "Course Not Found !",
              error: "Course not found !",
            });

        //enroll in it
        const enrolledCourse = await Course.findByIdAndUpdate(
          courseId,
          {
            $push: {
              studentsEnrolled: userId,
            },
          },
          { new: true }
        );
        if (!enrolledCourse) {
          console.log("Course Not Found ! ------>> ", enrolledCourse);
          return res
            .status(400)
            .json({
              success: false,
              message: "Course Not Found !",
              error: "Course Not Found !",
            });
        }
        // find student add course id in user's enrolledCourses

        const enrolledStudent = await User.findByIdAndUpdate(
          userId,
          {
            $push: {
              courses: courseId,
            },
          },
          { new: true }
        );
        if (!enrolledStudent) {
          console.log("Student Enrolled Not Found ! ------>> ", enrolledCourse);
          return res
            .status(400)
            .json({
              success: false,
              message: "Student Enrolled Found !",
              error: "Course Not Found !",
            });
        }

        // mubarak ho bachha hua mail bhejo (course enroll hua)
        // send confirmation mail
        const emailResponse = await mailSender(
          enrolledStudent.email,
          "Congratulations, You are onboarded to our Course",
          "We are commited to help you to achieve milestones in your full learning jounrey"
        );
        console.log(
          "Email sent on Successfull course purchase --->> ",
          emailResponse
        );

        return res.status(200).json({
          success: true,
          message: "Signature Verified and course added in your account",
        });
      } catch (error) {
        console.log(
          "❌ Error in course fulfillment logic --->>",
          error.message
        );
        return res.status(500).json({
          success: false,
          message: "Something went wrong while fulfilling the course",
          error: error.message,
        });
      }
    } else {
      // ❌ invalid or tampered request
      // ❌ Invalid signature
      console.log("❌ Razorpay signature mismatch");
      return res.status(400).json({
        success: false,
        message: "Invalid signature!",
        error: "Tampered webhook data",
      });
    }
  } catch (error) {
    console.log(
      chalk.bgRedBright(
        "Error in verifySignatureController function in payment.controller.js --->> ",
        error.message
      )
    );
    return res.status(503).json({
      success: false,
      message: "Failed to Verify Signature !",
      error: "Failed to Verify Signature !",
    });
  }
};

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    accountType:{
        type:String,
        enum:['Student','Admin','Instructor'],
        message: "Please select Student, Admin, or Instructor",
        required:true
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Profile',
        required:true
    },
    courses:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Courses',
        required:true  
        }
    ],
    profilePic:{
        type:String,
        required:true
    },
    courseProgress:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'CourseProgress'
        }
    ],
    token:{
        type:String
    },
    resetPasswordExpires:{
        type:Date
    }
},{timestamps:true})

const User = mongoose.models.User || mongoose.model('User',userSchema)
export default User
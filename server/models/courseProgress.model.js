import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema({
  courseId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Course'
  },
  completedVideos:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Subsection'
      }
  ]
},{timestamps:true})

const CourseProgress = mongoose.model('CourseProgress',courseProgressSchema)
export default CourseProgress
import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema({
    courseName:{
        type:String,
        required:true,
        trim:true
    },
    courseDescription:{
        type:String,
        required:true,
        trim:true
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    whatYouWillLearn:{
        type:String,
        required:true,
        trim:true
    },
    courseContent:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Section' 
    },
    ratingReview:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'RatingReview',
            required:true
        }
    ],
    price:{
        type:Number,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    tag:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Tag',
        required:true
    },
    studentsEnrolled:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        }
    ]
})

const Course = mongoose.model('Course',courseSchema)
export default Course
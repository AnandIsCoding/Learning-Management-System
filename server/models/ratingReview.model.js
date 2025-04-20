import mongoose from 'mongoose'
const ratingReviewSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.types.ObjectId,
        ref:'User',
        required:true
    },
    rating:{
        type:Number,
        required:true,
    },
    review:{
        type:String,
        required:true,
        trim:true
    }
})

const RatingReview = mongoose.model('RatingReview',ratingReviewSchema)
export default RatingReview
import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    gender:{
        type:String,
        enum:['male','female','others'],
        message: "Please select male, female, or others",
        required:true
    },
    dateOfBirth:{
        type:String,
        required:true
    },about:{
        type:String,
        trim:true
    },
    contactNumber:{
        type:Number,
        trim:true,
        required:true
    }
})

const Profile = mongoose.model.Profile || mongoose.model('Profile',profileSchema)
export default Profile
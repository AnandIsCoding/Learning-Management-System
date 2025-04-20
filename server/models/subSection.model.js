import mongoose from 'mongoose'

const subSectionSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    timeDuration:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    videoUrl:{
        type:String,
        required:true
    }
})

const SubSection = mongoose.model('SubSection',subSectionSchema)
export default SubSection
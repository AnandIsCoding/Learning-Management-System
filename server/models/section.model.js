import mongoose from 'mongoose'
const sectionSchema = new mongoose.Schema({
    sectionName:{
        type:String,
        required:true
    },
    subSection:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'SubSection',
        required:true
    }
},{timestamps:true})

const Section = mongoose.model('Section',sectionSchema)
export default Section;
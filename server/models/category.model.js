import mongoose from 'mongoose'
const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    course:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Course'
        }
    ]
},{timestamps:true})
const Category = mongoose.model('Tag',categorySchema)
export default Category
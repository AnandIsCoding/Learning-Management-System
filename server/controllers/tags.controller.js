import Tag from "../models/tags.model";

export const createTagController = async(req,res) =>{
    try {
        const {name,description} = req.body
        if(!name || !description){
            return res.status(409).json({
                success:false,
                message:'Required firld missing!',
                error:'Required firld missing!'
            })
        }
        //create entry in db
        const tagDetails = await Tag.create({
            name:name, description:description
        })
        return res.status(200).json({success:true, message:'Tag Created Successfully !', tagDetails})
    } catch (error) {
        console.log(
            chalk.bgRedBright(
              "Error in createTagController function in tags.controller.js --->> ",
              error.message
            )
          );
          return res.status(503).json({
            success: false,
            message: "Internal Server Error!",
            error: "Internal Server Error!",
          });
    }
}


export const getAllTagsController = async(req,res) =>{
    try {
        const allTags = await Tag.find({},{name:true,description:true})
        return res.status(200).json({
            success:true,
            message:'Tags Fetched Successfully',
            allTags
        })
    } catch (error) {
        console.log(
            chalk.bgRedBright(
              "Error in getAllTagsController function in tags.controller.js --->> ",
              error.message
            )
          );
          return res.status(503).json({
            success: false,
            message: "Internal Server Error!",
            error: "Internal Server Error!",
          });   
    }
}
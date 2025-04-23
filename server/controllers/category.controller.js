
import Category from "../models/category.model"

export const createCategoryController = async(req,res) =>{
    try {
        const {name,description} = req.body
        if(!name || !description){
            return res.status(409).json({
                success:false,
                message:'Required field missing!',
                error:'Required field missing!'
            })
        }
        //create entry in db
        const categoryDetails = await Category.create({
            name:name, description:description
        })
        return res.status(200).json({success:true, message:'Category Created Successfully !', tagDetails})
    } catch (error) {
        console.log(
            chalk.bgRedBright(
              "Error in createCategoryController function in category.controller.js --->> ",
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


export const getAllCategoryController = async(req,res) =>{
    try {
        const allCategory = await Category.find({},{name:true,description:true})
        return res.status(200).json({
            success:true,
            message:'Category Fetched Successfully',
            allCategory
        })
    } catch (error) {
        console.log(
            chalk.bgRedBright(
              "Error in getAllCategoryController function in category.controller.js --->> ",
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
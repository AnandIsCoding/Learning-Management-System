import Section from "../models/section.model";
import Course from '../models/course.model.js'

export const createSectionController = async(req,res) =>{
    try {
        const {sectionName, courseId} = req.body
        if(!sectionName || !courseId){
            return res.status(400).json({success:false, message:'Required Field Missing !', error:'Required Field Missing !'})
        }
        //create Section
        const newSection = await Section.create({sectionName})
        //update course with section ObjectId
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    courseContent:newSection._id
                }
            },
            {new:true}
        )
        /// HW: use populate to replace section subsections both in the updated course details
        
        //return response
        return res.status(200).json({success:true, message:'Section created successfully !',updatedCourseDetails})


    } catch (error) {
        console.log(
            chalk.bgRedBright(
              "Error in createSectionController function in section.controller.js --->> ",
              error.message
            )
          );
          return res.status(503).json({
            success: false,
            message: "Internal Server Error",
            error: "Internal Server Error",
          });
    }
}


export const updateSectionController = async(req,res) =>{
    try {
        const {sectionName, sectionId} = req.body
        if(!sectionName){
            return res.status(400).json({success:false, message:'Required Field Missing !', error:'Required Field Missing !'})
        }
        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            {sectionName:sectionName},
            {new:true}
        )
        return res.status(200).json({success:true, message:'Edit Saved Successfully !', updatedSection})
    } catch (error) {
        console.log(
            chalk.bgRedBright(
              "Error in updateSectionController function in section.controller.js --->> ",
              error.message
            )
          );
          return res.status(503).json({
            success: false,
            message: "Internal Server Error",
            error: "Internal Server Error",
          });
    }
}


export const deleteSectionController = async(req,res) =>{
    try {
        // accepting sectionId from params
        const {sectionId} = req.params
        if(!sectionId) return res.status(400).json({success:false, message:'Required Field Missing !',error:'Required Field Missing !'})
        await Section.findByIdAndDelete(sectionId)
        // todo : do we need to delete sectionId from course❓❓❓❓❓❓❓❓❔❔❔❔❔❔❔❔❔❔❔🤔🤔🤔🤔🤔
        return res.status(200).json({success:true, message:'Section Deleted Successfully !'})

    } catch (error) {
        console.log(
            chalk.bgRedBright(
              "Error in deleteSectionController function in section.controller.js --->> ",
              error.message
            )
          );
          return res.status(503).json({
            success: false,
            message: "Internal Server Error",
            error: "Internal Server Error",
          });
    }
}
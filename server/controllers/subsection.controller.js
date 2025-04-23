import { uploadFileToCloudinary } from "../utils/helpers.utils"
import SubSection from '../models/subSection.model.js'
import Section from '../models/section.model.js'
import dotenv from 'dotenv'
import chalk from "chalk"
dotenv.config()

export const createSubsectionController = async(req,res) =>{
    try {
        const {sectionId, title, timeDuration, description} = req.body
        const {video} = req.files
        if(!title || !timeDuration || !description || videoUrl){
            return res.status(400).json({success:false, message:'Required Field Missing !', error:'Required Field Missing !'})
        }
        const videoUploadDetails = await uploadFileToCloudinary(video, process.env.FOLDER_NAME)
        // create subSection
        const subSectionDetails = await SubSection.create({
            title,timeDuration,description,
            videoUrl:videoUploadDetails.secure_url
        })
        const updatedSection = Section.findByIdAndUpdate(
            sectionId,
            {
                $push:{
                    subSection:subSectionDetails._id
                }
            },
            {new:true}
        )
        // Todo : log updated section after populate query➡️⬅️❓❔❓➡️

        //return response
        return res.status(200).json({success:true,message:'Subsection created Successfully !'})
    } catch (error) {
        console.log(
            chalk.bgRedBright(
              "Error in createSubsectionController function in subsection.controller.js --->> ",
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


export const updateSubsectionController = async(req,res) =>{
    try {
        const {subSectionId, title, timeDuration, description} = req.body
        const {video} = req.files
        
    } catch (error) {
        console.log(
            chalk.bgRedBright(
              "Error in updateSubsectionController function in subsection.controller.js --->> ",
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
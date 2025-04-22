import { v2 as cloudinary } from "cloudinary";

// helper function to upload file to cloudinary
export const uploadFileToCloudinary = async (file, folder, height, quality) => {
    const options = { folder };
    if(height) options.height = height
    if(quality) options.quality = quality
    options.resource_type = 'auto'
    return await cloudinary.uploader.upload(file.tempFilePath, options); 
};

// take type of file and array of supportedtypes, and return true or false, if supported (filetype is included in supportedTypes array) than true otherwise false
export const isFileTypeSupported = (type, supportedTypes) =>{
    return supportedTypes.includes(type) 
}
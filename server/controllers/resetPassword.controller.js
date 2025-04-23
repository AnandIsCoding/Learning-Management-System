import bcrypt from 'bcrypt'
import User from '../models/user.model.js'
import mailSender from '../utils/mailSender.utils.js'
import chalk from 'chalk'

// resetPasswordToken

export const resetPasswordTokenController = async(req,res) =>{
    try {
        // email from req.body, check for existence, generate link
        // generate token
        // update user by adding token and expiration time
        // create url
        // send mail containing the url
        // return response
        const {email} = req.body
        if(!email) return res.status(409).json({success:false, message:'Email required'})
        const user = await User.findOne({email})
        if(!user) return res.status(404).json({success:false,message:'Email not registered',error:'Email not registered'})
        //generate token
        const token = crypto.randomUUID()
        //update user by adding token and expiry
        const updatedUser = await User.findOneAndUpdate({email:email},{token:token,resetPasswordExpires: Date.now()+ 5*60*1000},{new:true})
        //create url
        const url = `https://localhost:5173/update-password/${token}`
        //send mail containing url
        await mailSender(email,'Password Reset Link',`Password Reset Link : ${url}`)
        return res.status(200).json({success:true, message:'Email Sent Successfully!, Please check and reset your password!'})
    } catch (error) {
        console.log(
            chalk.bgRedBright(
              "Error in resetPasswordTokenController function in resetPassword.controller.js --->> ",
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






// resetPassword
export const resetPasswordController = async(req,res) =>{
    try {
        //fetch password, confirmPassword, token from req.body, 
        // token isn't present in req.body, but frontend code will take token from params and than send in request body
        // todo : fetch data, validate it, get user from db using token
        // if no token entry- invalid token
        // check token time
        //hash password and update password
        const {token, password,confirmPassword} = req.body
        if(!token) return res.status(409).json({success:false, message:'Token missing', error:'Token missing'})
        if(!password || !confirmPassword) return res.status(409).json({success:false,message:'Required fields missing', error:'Required fields missing'})
        if(password !== confirmPassword) return res.status(409).json({success:false,message:'password and confirmpassword not matching', error:'password and confirmpassword not matching'})
        //get userDetails from DB using token
        const user = await User.findOne({token:token})
        if(!user) return res.status(404).json({success:false,message:'User not found', error:'User not found'})
        if(user.resetPasswordExpires < Date.now()){
            return res.status(409).json({success:false, message:'Token Expired',error:'Token Expired'})
        }
        const encryptedPassword = await bcrypt.hash(password,10)
        await user.findOneAndUpdate({token:token},{password:encryptedPassword},{new:true})
        //return response
        return res.status(200).json({success:true,message:'Password reset successfull'})
    } catch (error) {
        console.log(
            chalk.bgRedBright(
              "Error in resetPasswordController function in resetPassword.controller.js --->> ",
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
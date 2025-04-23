import chalk from 'chalk'
import mongoose from 'mongoose'
import mailSender from '../utils/mailSender.utils'

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60
    }
},{timestamps:true})

// send email function for verification
async function sendVerificationEmail(email,otp){
    try {
        const mailResponse = await mailSender(email, 'Verification Email from Chaipiladona❤️ ',otp)
        console.log('Email sent successfully : ',mailResponse)
    } catch (error) {
        console.log(chalk.bgRed('Error in sendVerificatonEmail fun() ---->> ',error.message))
        throw error
    }
}

// pre middleware
otpSchema.pre('save', async function(next){
    await sendVerificationEmail(this.email, this.otp);
    next()
})

const OTP = mongoose.model('OTP',otpSchema)
export default OTP
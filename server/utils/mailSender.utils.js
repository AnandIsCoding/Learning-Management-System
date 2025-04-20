import nodemailer from 'nodemailer'
import chalk from 'chalk'
import dotenv from 'dotenv'
dotenv.config()


const mailSender = async(email,title,body) =>{
    try {
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user: process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        })
        let info = await transporter.sendMail({
            from:'Chai Courses -- By Anand Jha',
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        })
        console.log(info)
        return info
    } catch (error) {
        console.log(chalk.bgRed('Error in mailSender function in utils ----> ',error.message))
    }
}

export default mailSender


//this is just for the generation of mail

import Mailgen from "mailgen";
import nodemailer from "nodemailer";


//make sure you put the port inside send mail wrapperd in numner
// i.e,   sendMail -> port = Number(process.env.....), this is beacuse the port when used like that, takes a strinf and port a number and
//                                                     port should always be number.


const sendEmail = async (options) => {

    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Task Manager",
            //review this
            link: "https://mailgen.js/"
        }
    });

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: Number(process.env.MAILTRAP_SMTP_PORT),
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS
        }
    });

    
    const emailHtml = mailGenerator.generate(options.mailgenContent);
    const emailText = mailGenerator.generatePlaintext(options.mailgenContent);



    //  ** changes Mail -> mail
    const mail = {
        from: '"Task Manager" <no-reply@taskmanager.com>',
        to: options.email,
        subject: options.subject,
        text: emailText,
        html: emailHtml
    };

    try {
        await transporter.sendMail(mail);
    } catch (error) {
        console.error("Email not sent. Check credentials");
        console.error(error);
    }
};





const emailVerificationMailgenContent = (username,verificationUrl)=>{
    return{
        body: {
        name: username,
        intro: 'Welcome to the app.',
        action: {
            instructions: 'to get on boaord please click in the button below',
            button: {
                color: '#22BC66', // Optional action button color
                text: 'Confirm your account',
                link: verificationUrl
            }
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        },
    };
};


const forgotPassword = (username,passwordResetUrl)=>{
    return{
        body: {
        name: username,
        intro: 'Reset password Link below',
        action: {
            instructions: 'Click on the link below for reseting password',
            button: {
                color: '#22BC66', // Optional action button color
                text: 'Reset your password',
                link: passwordResetUrl
            }
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }
    }
}

export {forgotPassword,emailVerificationMailgenContent,sendEmail}
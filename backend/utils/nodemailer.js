import nodemailer from "nodemailer"

// Configuration of Nodemailer Transport Object
const createTransport = (user) => {
    return nodemailer.createTransport({
        host: "smtp.gmail.com", // Gmail SMTP server hostname
        port: 465,  // Port for SMTP over SSL/TLS
        secure: true,   // Enable SSL/TLS encryption
        auth: {
            type: 'OAuth2', // Authentication mechanism type
            user: user.email,   // User's email address
            accessToken: user.accessToken   // User's access token
        }
    })
}

export default createTransport;
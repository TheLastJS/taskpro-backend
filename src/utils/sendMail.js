import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for other ports like 587
  requireTLS: true, // Force TLS
  auth: {
    user: process.env.GMAIL_USER, // Gmail address
    pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password
  },
});

export const sendEmail = async (options) => {
  return await transporter.sendMail(options);
};
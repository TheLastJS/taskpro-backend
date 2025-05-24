import fs from 'node:fs/promises';
import path from 'node:path';
import { sendEmail } from '../utils/sendMail.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import createHttpError from 'http-errors';

const HTML_TEMPLATE_PATH = path.join(
  process.cwd(),
  'src',
  'templates',
  'need-help-mail.html',
);

const sendNeedHelpEmailController = async (req, res) => {
  const { email, message } = req.body;
  const supportEmail = process.env.SUPPORT_EMAIL;

  console.log('Received help request:', { email, message });
  console.log('Environment variables:', {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    GMAIL_USER: process.env.GMAIL_USER,
    SUPPORT_EMAIL: process.env.SUPPORT_EMAIL,
    // Not logging GMAIL_APP_PASSWORD for security
  });

  if (!supportEmail) {
    console.error('SUPPORT_EMAIL is not defined in environment variables');
    throw createHttpError(
      500,
      'Server configuration error: SUPPORT_EMAIL is not defined.',
    );
  }

  try {
    console.log('Reading email template from:', HTML_TEMPLATE_PATH);
    let htmlContent = await fs.readFile(HTML_TEMPLATE_PATH, 'utf-8');
    htmlContent = htmlContent
      .replace('{{userEmail}}', email)
      .replace('{{message}}', message)
      .replace('{{year}}', new Date().getFullYear());

    const mailOptions = {
      from: `"TaskPro Support" <${process.env.GMAIL_USER}>`,
      to: supportEmail,
      subject: 'New Need Help Request',
      html: htmlContent,
    };

    console.log('Attempting to send email...');
    await sendEmail(mailOptions);
    console.log('Email sent successfully');

    res.status(200).json({
      message: 'Help request sent successfully.',
    });
  } catch (error) {
    console.error('Detailed error in help controller:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    throw createHttpError(500, 'Failed to send help request email.');
  }
};

export const helpController = {
  sendNeedHelpEmail: ctrlWrapper(sendNeedHelpEmailController),
};

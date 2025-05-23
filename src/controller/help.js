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

  if (!supportEmail) {
    throw createHttpError(
      500,
      'Server configuration error: SUPPORT_EMAIL is not defined.',
    );
  }

  try {
    let htmlContent = await fs.readFile(HTML_TEMPLATE_PATH, 'utf-8');
    htmlContent = htmlContent
      .replace('{{userEmail}}', email)
      .replace('{{message}}', message)
      .replace('{{year}}', new Date().getFullYear());

    const mailOptions = {
      from: `"TaskPro Support" <${process.env.GMAIL_USER}>`, // Sender address with display name
      to: supportEmail, // List of receivers (your support email, also your Gmail)
      subject: 'New Need Help Request', // Subject line
      html: htmlContent, // HTML body content
    };

    await sendEmail(mailOptions);

    res.status(200).json({
      message: 'Help request sent successfully.',
    });
  } catch (error) {
    console.error('Error sending help email:', error);
    throw createHttpError(500, 'Failed to send help request email.');
  }
};

export const helpController = {
  sendNeedHelpEmail: ctrlWrapper(sendNeedHelpEmailController),
};

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const password = process.env.ADMIN_PASSWORD;
const user = process.env.ADMIN_EMAIL;
const baseUrl = process.env.BASE_URL;

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: user,
    pass: password,
  },
});

const sendEmail = (to, subject, html) => {
  const mailOptions = {
    from: user,
    to,
    subject,
    html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error:', error);
    } else {
      console.log(`Email sent to: ${to}, info: `, info.response);
    }
  });
};

// When user submits a question
export const sendEmailConfirmation = (userEmail) => {
  const html = `
    <div style="font-family: 'Arial', sans-serif; background-color: #ffffff; padding: 20px; text-align: center; border: 1px solid #ddd; border-radius: 15px; max-width: 600px; margin: auto;">
      <h1 style="font-size: 24px; color: #333; margin-bottom: 10px;">Thank You for Sharing Your Question!</h1>
      <p style="font-size: 16px; color: #555; margin-bottom: 20px; line-height: 1.5;">
        As soon as your question receives a response, we will notify you via email.
      </p>
      <div style="margin: 30px 0;">
        <a href=${baseUrl} style="display: inline-block; padding: 12px 25px; font-size: 16px; font-weight: bold; color: #ffffff; background-color:rgba(101, 172, 255, 1); border-radius: 5px; text-decoration: none;">
          Visit EducationBox
        </a>
      </div>
      <p style="font-size: 14px; color: #777;">
        Thanks for using EducationBox!<br>
        <strong>- The EducationBox Team</strong>
      </p>
    </div>
  `;
  sendEmail(userEmail, 'Your Question Was Submitted Successfully', html);
};

// When user receives a response to their question
export const sendAnswerNotification = (userEmail, questionId) => {
  const html = `
    <div style="font-family: 'Arial', sans-serif; background-color: #ffffff; padding: 20px; text-align: center; border: 1px solid #ddd; border-radius: 15px; max-width: 600px; margin: auto;">
      <h1 style="font-size: 24px; color: #333; margin-bottom: 10px;">Your Question Got an Answer!</h1>
      <p style="font-size: 16px; color: #555; margin-bottom: 20px; line-height: 1.5;">
        Someone has responded to your question. Click below to view the answer.
      </p>
      <div style="margin: 30px 0;">
        <a href="${baseUrl}/question/${questionId}" style="display: inline-block; padding: 12px 25px; font-size: 16px; font-weight: bold; color: #ffffff; background-color: rgba(101, 172, 255, 1); border-radius: 5px; text-decoration: none;">
          View Your Question
        </a>
      </div>
      <p style="font-size: 14px; color: #777;">
        Thanks for using EducationBox!<br>
        <strong>- The EducationBox Team</strong>
      </p>
    </div>
  `;
  sendEmail(userEmail, 'Your Question Received an Answer!', html);
};

// When a user adds a comment on an answer
export const sendCommentNotification = (userEmail, questionId) => {
  const html = `
    <div style="font-family: 'Arial', sans-serif; background-color: #ffffff; padding: 20px; text-align: center; border: 1px solid #ddd; border-radius: 15px; max-width: 600px; margin: auto;">
      <h1 style="font-size: 24px; color: #333; margin-bottom: 10px;">New Comment on Your Reply</h1>
      <p style="font-size: 16px; color: #555; margin-bottom: 20px; line-height: 1.5;">
        Someone added a comment to your reply. Click below to view the discussion.
      </p>
      <div style="margin: 30px 0;">
        <a href="${baseUrl}/question/${questionId}" style="display: inline-block; padding: 12px 25px; font-size: 16px; font-weight: bold; color: #ffffff; background-color: rgba(101, 172, 255, 1); border-radius: 5px; text-decoration: none;">
          View the Discussion
        </a>
      </div>
      <p style="font-size: 14px; color: #777;">
        Stay connected with your community.<br>
        <strong>- The EducationBox Team</strong>
      </p>
    </div>
  `;
  sendEmail(userEmail, 'New Comment on Your Reply', html);
};

// When user deletes their account
export const sendAccountDeletionConfirmation = (userEmail) => {
  const html = `
    <div style="font-family: 'Arial', sans-serif; background-color: #ffffff; padding: 20px; text-align: center; border: 1px solid #ddd; border-radius: 15px; max-width: 600px; margin: auto;">
      <h1 style="font-size: 24px; color: #e74c3c; margin-bottom: 10px;">Your Account Has Been Deleted</h1>
      <p style="font-size: 16px; color: #555; margin-bottom: 20px; line-height: 1.5;">
        Your account and personal data have been successfully removed from EducationBox.
      </p>
      <p style="font-size: 16px; color: #555; margin-bottom: 20px; line-height: 1.5;">
        Please note: Any public content you posted (questions, answers, or comments) may still be visible on the site.
      </p>
      <div style="margin: 30px 0;">
        <a href=${baseUrl} style="display: inline-block; padding: 12px 25px; font-size: 16px; font-weight: bold; color: #ffffff; background-color:rgba(101, 172, 255, 1); border-radius: 5px; text-decoration: none;">
          Return to EducationBox
        </a>
      </div>
      <p style="font-size: 14px; color: #777;">
        We're sorry to see you go.<br>
        <strong>- The EducationBox Team</strong>
      </p>
    </div>
  `;
  sendEmail(userEmail, 'Your EducationBox Account Has Been Deleted', html);
};

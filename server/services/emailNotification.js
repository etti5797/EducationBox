import nodemailer from 'nodemailer';
import dotenv from 'dotenv';


dotenv.config();
const password = process.env.ADMIN_PASSWORD
const user = process.env.ADMIN_EMAIL
const baseUrl = process.env.BASE_URL

// runs when a user submits a question - sends a confirmation email
export const sendEmailConfirmation = (userEmail) => {
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: user,
      pass: password,  
    },
  });

  let mailOptions = {
    from: user,
    to: userEmail,
    subject: 'Your Question Was Submitted Successfully',
    html: `
      <div style="font-family: 'Arial', sans-serif; background-color: #ffffff; padding: 20px; text-align: center; border: 1px solid #ddd; border-radius: 15px; max-width: 600px; margin: auto;">
        <h1 style="font-size: 24px; color: #333; margin-bottom: 10px;">Thank You for Sharing Your Question!</h1>
        <p style="font-size: 16px; color: #555; margin-bottom: 20px; line-height: 1.5;">
          As soon as your question receives a response, we will notify you via email.
        </p>
        <div style="margin: 30px 0;">
          <a href=${baseUrl} style="display: inline-block; padding: 12px 25px; font-size: 16px; font-weight: bold; color: #ffffff; background-color: #6c63ff; border-radius: 5px; text-decoration: none;">
            Visit EducationBox
          </a>
        </div>
        <p style="font-size: 14px; color: #777;">
          Thank you for being a part of our community!<br>
          <strong>- The EducationBox Team</strong>
        </p>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// runs when a user receives a response to their question

  
// runs when a user response to anther comment - need to add comment to comments....
  
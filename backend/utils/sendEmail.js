const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  // console.log("Recipient:", to);
  try {
    // transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    // send mail
    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully");
    
  //   const info = await transporter.sendMail(mailOptions);

  // console.log("Email sent successfully");
  // console.log("Message ID:", info.messageId);
  // console.log("Response:", info.response);

  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;